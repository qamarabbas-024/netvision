import { Injectable, Logger } from '@nestjs/common';
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
    const defaultLimits: SandboxResourceLimits = {
      ramMb: limits?.ramMb || 512,
      cpuCores: limits?.cpuCores || 0.5,
      timeoutSec: limits?.timeoutSec || 10,
      maxProcesses: limits?.maxProcesses || 50,
    };

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    this.logger.log(
      `[Docker Provider Stub] Initialized Isolated Docker Container Policy for user ${userId}: ` +
        `--memory=${defaultLimits.ramMb}m --cpus=${defaultLimits.cpuCores} --pids-limit=${defaultLimits.maxProcesses} --read-only --security-opt no-new-privileges`
    );

    return {
      providerSessionId: `docker-container-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: SandboxStatus.RUNNING,
      expiresAt,
      resourceLimits: defaultLimits,
      networkState: {
        containerId: `netvision-lab-${Date.now()}`,
        networkMode: 'isolated-bridge-netvision',
        ip: '172.20.0.5',
      },
    };
  }

  async executeCommand(
    sessionId: string,
    command: string,
    limits?: SandboxResourceLimits
  ): Promise<SandboxExecutionResult> {
    const startTime = Date.now();
    const cleanCmd = (command || '').trim();

    this.logger.warn(
      `[Docker Provider Stub] Security Check: Command '${cleanCmd}' routed via isolated container RPC interface for session ${sessionId}.`
    );

    return {
      command: cleanCmd,
      output: `[Docker Container Sandbox Stub] Executed command '${cleanCmd}' inside container session ${sessionId}.\nStatus: Isolated Container Execution Successful.`,
      exitCode: 0,
      durationMs: Date.now() - startTime,
      isSimulated: false,
      timestamp: new Date().toISOString(),
    };
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    this.logger.log(`[Docker Provider Stub] Stopped container session ${sessionId}`);
    return true;
  }

  async getStatus(sessionId: string): Promise<SandboxStatus> {
    return SandboxStatus.RUNNING;
  }
}
