import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SandboxStatus } from '@prisma/client';
import {
  ISandboxProvider,
  SandboxExecutionResult,
  SandboxResourceLimits,
} from './sandbox-provider.interface';

@Injectable()
export class DockerSandboxProvider implements ISandboxProvider {
  readonly providerName = 'DOCKER';
  private readonly logger = new Logger(DockerSandboxProvider.name);

  async createEnvironment(
    userId: string,
    labId?: string,
    limits?: Partial<SandboxResourceLimits>
  ): Promise<{
    providerSessionId: string;
    status: SandboxStatus;
    expiresAt: Date;
    resourceLimits: SandboxResourceLimits;
    networkState: Record<string, any>;
  }> {
    this.logger.warn(`Rejected DOCKER sandbox session creation request for user ${userId}`);
    throw new BadRequestException(
      'Docker sandbox provider is not available in this environment. Please use providerType SIMULATED.'
    );
  }

  async executeCommand(
    sessionId: string,
    command: string,
    limits?: SandboxResourceLimits
  ): Promise<SandboxExecutionResult> {
    this.logger.warn(`Rejected DOCKER sandbox command execution for session ${sessionId}`);
    throw new BadRequestException(
      'Docker sandbox provider is not available in this environment. Container execution is disabled.'
    );
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    this.logger.log(`[Docker Provider Safety] Terminated Docker stub session ${sessionId}`);
    return true;
  }

  async getStatus(sessionId: string): Promise<SandboxStatus> {
    return SandboxStatus.STOPPED;
  }
}
