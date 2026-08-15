import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../mail/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly devOtpStore = new Map<string, string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  getDevOtpForTest(email: string): string | null {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    if (isProd) return null;
    return this.devOtpStore.get(email.toLowerCase().trim()) || null;
  }

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private isDevModeNoEmail(): boolean {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    if (isProd) return false;
    return !this.emailService.isConfigured();
  }

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const normalizedUsername = dto.username.toLowerCase().trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        throw new ConflictException('An account with this email address already exists.');
      }
      throw new ConflictException('This username is already taken. Please choose another.');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
        fullName: dto.fullName?.trim() || null,
        isVerified: false,
      },
    });

    // Generate secure 6-digit numeric OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = this.hashToken(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Clear previous verification records for email
    await this.prisma.emailVerification.deleteMany({
      where: { email: normalizedEmail },
    });

    await this.prisma.emailVerification.create({
      data: {
        email: normalizedEmail,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    if (this.isDevModeNoEmail()) {
      this.devOtpStore.set(normalizedEmail, rawOtp);
      this.logger.warn(`📧 [DEV EMAIL CONSOLE LOG] Verification OTP for ${normalizedEmail}: ${rawOtp}`);
    }

    await this.emailService.sendVerificationOtp(normalizedEmail, rawOtp);

    return {
      message: 'Registration successful! A 6-digit verification code has been dispatched to your email address.',
      email: normalizedEmail,
      requiresOtp: true,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const sanitizedOtp = dto.otp.trim().replace(/\D/g, '');

    if (sanitizedOtp.length !== 6) {
      throw new BadRequestException('OTP code must be a 6-digit numeric code.');
    }

    const verificationRecord = await this.prisma.emailVerification.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    });

    if (!verificationRecord) {
      throw new UnauthorizedException('No active verification process found for this email. Please sign up or request a new code.');
    }

    if (new Date() > verificationRecord.expiresAt) {
      await this.prisma.emailVerification.deleteMany({ where: { email: normalizedEmail } });
      throw new UnauthorizedException('Verification OTP code has expired. Please request a new code.');
    }

    if (verificationRecord.attempts >= 3) {
      await this.prisma.emailVerification.deleteMany({ where: { email: normalizedEmail } });
      throw new UnauthorizedException('Maximum verification attempts exceeded. Please request a new OTP code.');
    }

    const incomingOtpHash = this.hashToken(sanitizedOtp);
    if (incomingOtpHash !== verificationRecord.otpHash) {
      // Increment failed attempt counter
      await this.prisma.emailVerification.update({
        where: { id: verificationRecord.id },
        data: { attempts: verificationRecord.attempts + 1 },
      });
      throw new UnauthorizedException('Invalid verification OTP code. Please check and try again.');
    }

    // Update user to verified in database
    const user = await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: { isVerified: true },
    });

    // Delete verification record immediately (single-use enforcement)
    await this.prisma.emailVerification.deleteMany({ where: { email: normalizedEmail } });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      message: 'Account verified successfully!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  async resendOtp(dto: ResendOtpDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Do not reveal email non-existence
      return { message: 'If an account exists for this email, a new verification code has been dispatched.' };
    }

    if (user.isVerified) {
      throw new BadRequestException('This account is already verified. You can log in directly.');
    }

    // Rate limit check: 60 sec window
    const recentOtp = await this.prisma.emailVerification.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp && Date.now() - recentOtp.createdAt.getTime() < 60 * 1000) {
      throw new BadRequestException('Please wait 60 seconds before requesting another verification code.');
    }

    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = this.hashToken(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.emailVerification.deleteMany({ where: { email: normalizedEmail } });

    await this.prisma.emailVerification.create({
      data: {
        email: normalizedEmail,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    if (this.isDevModeNoEmail()) {
      this.devOtpStore.set(normalizedEmail, rawOtp);
      this.logger.warn(`📧 [DEV EMAIL CONSOLE LOG] Resent Verification OTP for ${normalizedEmail}: ${rawOtp}`);
    }

    await this.emailService.sendVerificationOtp(normalizedEmail, rawOtp);

    return {
      message: 'A new 6-digit verification code has been dispatched to your email address.',
    };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = this.hashToken(rawOtp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.prisma.emailVerification.deleteMany({ where: { email: normalizedEmail } });
      await this.prisma.emailVerification.create({
        data: { email: normalizedEmail, otpHash, expiresAt, attempts: 0 },
      });
      if (this.isDevModeNoEmail()) {
        this.devOtpStore.set(normalizedEmail, rawOtp);
        this.logger.warn(`📧 [DEV EMAIL CONSOLE LOG] Unverified Login OTP for ${normalizedEmail}: ${rawOtp}`);
      }

      await this.emailService.sendVerificationOtp(normalizedEmail, rawOtp);

      throw new UnauthorizedException(
        'Account email is not verified. A new 6-digit OTP code has been dispatched to your email.'
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return { message: 'If your account exists, a password reset link has been dispatched to your email.' };
    }

    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } });
    await this.prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        used: false,
      },
    });

    await this.emailService.sendPasswordResetLink(normalizedEmail, rawResetToken);

    return { message: 'If your account exists, a password reset link has been dispatched to your email.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const incomingTokenHash = this.hashToken(dto.token.trim());

    const resetRecord = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash: incomingTokenHash, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord) {
      throw new UnauthorizedException('Invalid or expired password reset token.');
    }

    if (new Date() > resetRecord.expiresAt) {
      await this.prisma.passwordResetToken.deleteMany({ where: { email: resetRecord.email } });
      throw new UnauthorizedException('Password reset token has expired. Please request a new link.');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash: newPasswordHash },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return { message: 'Password reset successful! You may now sign in with your new password.' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    return user;
  }

  async validateOAuthUser(profile: {
    provider: 'google' | 'github';
    providerAccountId: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  }) {
    const normalizedEmail = profile.email.toLowerCase().trim();

    // 1. Check if OAuthAccount exists
    const existingOAuth = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId,
        },
      },
      include: { user: true },
    });

    if (existingOAuth) {
      const user = existingOAuth.user;
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return { user, ...tokens };
    }

    // 2. Search if User with matching email already exists
    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      if (!user.isVerified) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        });
      }
    } else {
      // 3. Create new NetVision User
      let baseUsername = (profile.fullName || normalizedEmail.split('@')[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');

      if (!baseUsername || baseUsername.length < 3) {
        baseUsername = `${profile.provider}_user_${Date.now().toString().slice(-4)}`;
      }

      let username = baseUsername;
      let counter = 1;
      while (await this.prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }

      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          username,
          fullName: profile.fullName || null,
          avatarUrl: profile.avatarUrl || null,
          role: 'STUDENT',
          isVerified: true,
          passwordHash: null,
        },
      });
    }

    // Link OAuthAccount
    await this.prisma.oAuthAccount.create({
      data: {
        userId: user.id,
        provider: profile.provider,
        providerAccountId: profile.providerAccountId,
        providerEmail: normalizedEmail,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return { user, ...tokens };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
