import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { AuthRateLimit, StrictAuthRateLimit, UserRateLimit } from '../security/rate-limiter/rate-limit.decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @AuthRateLimit()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: any) {
    const clientIp = req.ips?.[0] || req.ip || '127.0.0.1';
    return this.authService.register(dto, clientIp);
  }

  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Req() req: any) {
    const clientIp = req.ips?.[0] || req.ip || '127.0.0.1';
    return this.authService.verifyOtp(dto, clientIp);
  }

  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto, @Req() req: any) {
    const clientIp = req.ips?.[0] || req.ip || '127.0.0.1';
    return this.authService.resendOtp(dto, clientIp);
  }

  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: any) {
    const clientIp = req.ips?.[0] || req.ip || '127.0.0.1';
    return this.authService.login(dto, clientIp);
  }

  @StrictAuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: any) {
    const clientIp = req.ips?.[0] || req.ip || '127.0.0.1';
    return this.authService.forgotPassword(dto, clientIp);
  }

  @StrictAuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: any) {
    const clientIp = req.ips?.[0] || req.ip || '127.0.0.1';
    return this.authService.resetPassword(dto, clientIp);
  }

  // Google OAuth Initiate & Callback
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates Google OAuth redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const token = req.user?.accessToken;
    if (!token) {
      return res.redirect(`${frontendUrl}/login?error=OAuthAuthenticationFailed`);
    }

    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('netvision_auth_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.redirect(`${frontendUrl}/auth/callback`);
  }

  // GitHub OAuth Initiate & Callback
  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth() {
    // Initiates GitHub OAuth redirect
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const token = req.user?.accessToken;
    if (!token) {
      return res.redirect(`${frontendUrl}/login?error=OAuthAuthenticationFailed`);
    }

    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('netvision_auth_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.redirect(`${frontendUrl}/auth/callback`);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('netvision_auth_token', { path: '/' });
    return { message: 'Logged out successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }
}
