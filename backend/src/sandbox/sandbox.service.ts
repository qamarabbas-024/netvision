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

  async createSession(userId: string, dto: CreateSandboxSessionDto) {
    const provider = this.getProvider(dto.providerType);
    const durationMins = dto.durationMinutes || 30;

    // Call provider to initialize environment
    const env = await provider.createEnvironment(userId, dto.labId, {
      timeoutSec: 10,
    });

    const expiresAt = new Date(Date.now() + durationMins * 60 * 1000);

    const session = await this.prisma.sandboxSession.create({
      data: {
        userId,
        labId: dto.labId || null,
        status: SandboxStatus.RUNNING,
        expiresAt,
        providerType: provider.providerName,
        resourceLimitsJson: env.resourceLimits as any,
        networkStateJson: env.networkState as any,
        historyJson: [],
      },
    });

    this.logger.log(`Active Sandbox Session [${session.id}] started for user ${userId} (Expires: ${expiresAt.toISOString()})`);

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

  async executeCommand(userId: string, sessionId: string, dto: ExecuteSandboxCommandDto) {
    const session = await this.prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Sandbox session "${sessionId}" not found.`);
    }

    if (session.userId !== userId) {
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

  async getSessionStatus(userId: string, sessionId: string) {
    const session = await this.prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Sandbox session "${sessionId}" not found.`);
    }

    if (session.userId !== userId) {
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

  async terminateSession(userId: string, sessionId: string) {
    const session = await this.prisma.sandboxSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Sandbox session "${sessionId}" not found.`);
    }

    if (session.userId !== userId) {
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
