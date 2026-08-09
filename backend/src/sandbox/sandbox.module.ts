import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';
import { SimulatedSandboxProvider } from './providers/simulated-sandbox.provider';
import { DockerSandboxProvider } from './providers/docker-sandbox.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SandboxController],
  providers: [
    SandboxService,
    SimulatedSandboxProvider,
    DockerSandboxProvider,
  ],
  exports: [SandboxService, SimulatedSandboxProvider, DockerSandboxProvider],
})
export class SandboxModule {}
