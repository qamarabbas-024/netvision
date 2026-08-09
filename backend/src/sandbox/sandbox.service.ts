import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SandboxStatus } from '@prisma/client';
import { SimulatedSandboxProvider } from './providers/simulated-sandbox.provider';
import { DockerSandboxProvider } from './providers/docker-sandbox.provider';
import { ISandboxProvider } from './providers/sandbox-provider.interface';
import { CreateSandboxSessionDto } from './dto/create-sandbox-session.dto';
import { ExecuteSandboxCommandDto } from './dto/execute-sandbox-command.dto';

@Injectable()
export class SandboxService {
  private readonly logger = new Logger(SandboxService.name);
  private readonly providers: Record<string, ISandboxProvider>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly simulatedProvider: SimulatedSandboxProvider,
    private readonly dockerProvider: DockerSandboxProvider
  ) {
    this.providers = {
      SIMULATED: this.simulatedProvider,
      DOCKER: this.dockerProvider,
    };
  }

  private getProvider(type?: string): ISandboxProvider {
    const key = (type || 'SIMULATED').toUpperCase();
    return this.providers[key] || this.simulatedProvider;
  }

  private async ensureAnonymousLearner(anonymousId?: string) {
    if (!anonymousId) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(anonymousId)) {
      throw new BadRequestException(`Invalid anonymousId format "${anonymousId}". Must be a valid UUID.`);
    }

    try {
      return await this.prisma.anonymousLearner.upsert({
        where: { id: anonymousId },
        update: {},
        create: { id: anonymousId },
      });
    } catch (err) {
      const existing = await this.prisma.anonymousLearner.findUnique({
        where: { id: anonymousId },
      });
      if (existing) return existing;
      throw new BadRequestException('Failed to register anonymous learner session.');
    }
  }

  async createSession(identity: { userId?: string; anonymousId?: string }, dto: CreateSandboxSessionDto) {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('A valid user ID or anonymous learner ID is required.');
    }
    if (anonymousId && !userId) {
      await this.ensureAnonymousLearner(anonymousId);
    }

    // Limit active running sandbox sessions per owner to max 5
    const activeCount = await this.prisma.sandboxSession.count({
      where: userId
        ? { userId, status: SandboxStatus.RUNNING, expiresAt: { gt: new Date() } }
        : { anonymousId, status: SandboxStatus.RUNNING, expiresAt: { gt: new Date() } },
    });
    if (activeCount >= 5) {
      throw new BadRequestException('Maximum active sandbox session limit (5) reached. Please terminate an active session before starting a new one.');
    }

    const provider = this.getProvider(dto.providerType);
    const durationMins = dto.durationMinutes || 30;

    // Call provider to initialize environment
    const env = await provider.createEnvironment(userId || anonymousId!, dto.labId, {
      timeoutSec: 10,
    });

    const expiresAt = new Date(Date.now() + durationMins * 60 * 1000);

    const session = await this.prisma.sandboxSession.create({
      data: {
        userId: userId || null,
        anonymousId: anonymousId || null,
        labId: dto.labId || null,
        status: SandboxStatus.RUNNING,
        expiresAt,
        providerType: provider.providerName,
        resourceLimitsJson: env.resourceLimits as any,
        networkStateJson: env.networkState as any,
        historyJson: [],
      },
    });

    this.logger.log(`Active Sandbox Session [${session.id}] started for ${userId ? `user ${userId}` : `anonymous ${anonymousId}`} (Expires: ${expiresAt.toISOString()})`);

    return {
      sessionId: session.id,
      status: session.status,
      providerType: session.providerType,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      resourceLimits: session.resourceLimitsJson,
      networkState: session.networkStateJson,
    };
  }

  async executeCommand(identity: { userId?: string; anonymousId?: string }, sessionId: string, dto: ExecuteSandboxCommandDto) {
    const { userId, anonymousId } = identity;
    const session = await this.prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Sandbox session "${sessionId}" not found.`);
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException(`Access denied to sandbox session "${sessionId}".`);
    } else if (!userId && anonymousId && session.anonymousId !== anonymousId) {
      throw new ForbiddenException(`Access denied to sandbox session "${sessionId}".`);
    }

    // Expiration check
    if (new Date() > new Date(session.expiresAt) || session.status === SandboxStatus.EXPIRED) {
      await this.prisma.sandboxSession.update({
        where: { id: sessionId },
        data: { status: SandboxStatus.EXPIRED },
      });
      throw new BadRequestException(`Sandbox session "${sessionId}" has expired. Please launch a new lab session.`);
    }

    if (session.status !== SandboxStatus.RUNNING) {
      throw new BadRequestException(`Sandbox session "${sessionId}" is in status ${session.status} and cannot accept commands.`);
    }

    const provider = this.getProvider(session.providerType);
    const result = await provider.executeCommand(sessionId, dto.command, session.resourceLimitsJson as any);

    // Update command execution history
    const existingHistory = (session.historyJson as any[]) || [];
    const updatedHistory = [...existingHistory, result];

    await this.prisma.sandboxSession.update({
      where: { id: sessionId },
      data: { historyJson: updatedHistory },
    });

    return {
      sessionId: session.id,
      result,
      sessionStatus: session.status,
      expiresAt: session.expiresAt,
    };
  }

  async getSessionStatus(identity: { userId?: string; anonymousId?: string }, sessionId: string) {
    const { userId, anonymousId } = identity;
    const session = await this.prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Sandbox session "${sessionId}" not found.`);
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException(`Access denied to sandbox session "${sessionId}".`);
    } else if (!userId && anonymousId && session.anonymousId !== anonymousId) {
      throw new ForbiddenException(`Access denied to sandbox session "${sessionId}".`);
    }

    const isExpired = new Date() > new Date(session.expiresAt);
    let currentStatus = session.status;

    if (isExpired && currentStatus !== SandboxStatus.EXPIRED) {
      currentStatus = SandboxStatus.EXPIRED;
      await this.prisma.sandboxSession.update({
        where: { id: sessionId },
        data: { status: SandboxStatus.EXPIRED },
      });
    }

    return {
      sessionId: session.id,
      labId: session.labId,
      status: currentStatus,
      providerType: session.providerType,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isExpired,
      resourceLimits: session.resourceLimitsJson,
      networkState: session.networkStateJson,
      historyCount: ((session.historyJson as any[]) || []).length,
    };
  }

  async terminateSession(identity: { userId?: string; anonymousId?: string }, sessionId: string) {
    const { userId, anonymousId } = identity;
    const session = await this.prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Sandbox session "${sessionId}" not found.`);
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException(`Access denied to sandbox session "${sessionId}".`);
    } else if (!userId && anonymousId && session.anonymousId !== anonymousId) {
      throw new ForbiddenException(`Access denied to sandbox session "${sessionId}".`);
    }

    const provider = this.getProvider(session.providerType);
    await provider.terminateSession(sessionId);

    await this.prisma.sandboxSession.update({
      where: { id: sessionId },
      data: { status: SandboxStatus.STOPPED },
    });

    return {
      sessionId: session.id,
      status: SandboxStatus.STOPPED,
      message: 'Sandbox session terminated successfully.',
    };
  }

  async getUserSessions(identity: { userId?: string; anonymousId?: string }) {
    const { userId, anonymousId } = identity;
    const where = userId ? { userId } : anonymousId ? { anonymousId } : null;
    if (!where) return [];

    const sessions = await this.prisma.sandboxSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return sessions.map((s) => ({
      sessionId: s.id,
      labId: s.labId,
      status: s.status,
      providerType: s.providerType,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isExpired: new Date() > new Date(s.expiresAt),
    }));
  }

  async cleanupExpiredSessions() {
    const now = new Date();
    const result = await this.prisma.sandboxSession.updateMany({
      where: {
        status: SandboxStatus.RUNNING,
        expiresAt: { lt: now },
      },
      data: {
        status: SandboxStatus.EXPIRED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} expired sandbox sessions.`);
    }

    return result.count;
  }
}
