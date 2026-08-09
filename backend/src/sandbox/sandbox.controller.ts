import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SandboxService } from './sandbox.service';
import { CreateSandboxSessionDto } from './dto/create-sandbox-session.dto';
import { ExecuteSandboxCommandDto } from './dto/execute-sandbox-command.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { LearnerIdentity, LearnerIdentityContext } from '../auth/decorators/learner-identity.decorator';

@ApiTags('Sandbox Architecture')
@Controller('sandbox')
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @ApiOperation({ summary: 'List active and past sandbox sessions for current learner' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('sessions')
  async getUserSessions(@LearnerIdentity() identity: LearnerIdentityContext) {
    return this.sandboxService.getUserSessions(identity);
  }

  @ApiOperation({ summary: 'Initialize new isolated sandbox session for lab execution' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('sessions')
  async createSession(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: CreateSandboxSessionDto
  ) {
    return this.sandboxService.createSession(identity, dto);
  }

  @ApiOperation({ summary: 'Get status and telemetry of an active sandbox session' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('sessions/:id')
  async getSessionStatus(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('id') id: string
  ) {
    return this.sandboxService.getSessionStatus(identity, id);
  }

  @ApiOperation({ summary: 'Execute command safely in isolated sandbox session' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sessions/:id/execute')
  async executeCommand(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('id') id: string,
    @Body() dto: ExecuteSandboxCommandDto
  ) {
    return this.sandboxService.executeCommand(identity, id, dto);
  }

  @ApiOperation({ summary: 'Terminate active sandbox session' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sessions/:id/terminate')
  async terminateSession(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('id') id: string
  ) {
    return this.sandboxService.terminateSession(identity, id);
  }
}
