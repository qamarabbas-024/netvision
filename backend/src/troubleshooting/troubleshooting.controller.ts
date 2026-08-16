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
import { TroubleshootingService } from './troubleshooting.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { LearnerIdentity, LearnerIdentityContext } from '../auth/decorators/learner-identity.decorator';
import {
  ExecuteScenarioCommandDto,
  SubmitDiagnosisDto,
  ApplyRemediationDto,
  RunVerificationDto,
} from '@netvision/shared';

@ApiTags('troubleshooting')
@Controller('troubleshooting')
export class TroubleshootingController {
  constructor(private readonly troubleshootingService: TroubleshootingService) {}

  @ApiOperation({ summary: 'List all network troubleshooting scenarios' })
  @Get('scenarios')
  async getAllScenarios() {
    return this.troubleshootingService.getAllScenarios();
  }

  @ApiOperation({ summary: 'Get troubleshooting scenario details (safe public view)' })
  @Get('scenarios/:idOrSlug')
  async getScenarioDetails(@Param('idOrSlug') idOrSlug: string) {
    return this.troubleshootingService.getScenarioBySlugOrId(idOrSlug, false);
  }

  @ApiOperation({ summary: 'Get post-mortem explanation and root cause analysis' })
  @Get('scenarios/:idOrSlug/post-mortem')
  async getScenarioPostMortem(@Param('idOrSlug') idOrSlug: string) {
    return this.troubleshootingService.getScenarioPostMortem(idOrSlug);
  }

  @ApiOperation({ summary: 'Start or resume an interactive troubleshooting session' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('session/start')
  @HttpCode(HttpStatus.OK)
  async startSession(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body('scenarioId') scenarioId: string
  ) {
    return this.troubleshootingService.startSession(identity, scenarioId);
  }

  @ApiOperation({ summary: 'Get current status of a troubleshooting session' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('session/:sessionId')
  async getSessionStatus(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('sessionId') sessionId: string
  ) {
    return this.troubleshootingService.getSessionStatus(identity, sessionId);
  }

  @ApiOperation({ summary: 'Execute diagnostic command within scenario virtual network' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('session/execute')
  @HttpCode(HttpStatus.OK)
  async executeCommand(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: ExecuteScenarioCommandDto
  ) {
    return this.troubleshootingService.executeCommand(identity, dto);
  }

  @ApiOperation({ summary: 'Submit root cause diagnosis hypothesis' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('session/diagnose')
  @HttpCode(HttpStatus.OK)
  async submitDiagnosis(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: SubmitDiagnosisDto
  ) {
    return this.troubleshootingService.submitDiagnosis(identity, dto);
  }

  @ApiOperation({ summary: 'Apply remediation action / configuration fix' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('session/remediate')
  @HttpCode(HttpStatus.OK)
  async applyRemediation(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: ApplyRemediationDto
  ) {
    return this.troubleshootingService.applyRemediation(identity, dto);
  }

  @ApiOperation({ summary: 'Run verification test suite and finalize score' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('session/verify')
  @HttpCode(HttpStatus.OK)
  async runVerification(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: RunVerificationDto
  ) {
    return this.troubleshootingService.runVerification(identity, dto);
  }
}
