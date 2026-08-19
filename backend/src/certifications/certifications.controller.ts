import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CertificationsService, AnswerQuestionDto } from './certifications.service';
import { StartExamAttemptDto } from './dto/start-exam-attempt.dto';
import { SubmitExamAttemptDto } from './dto/submit-exam-attempt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExamType } from '@prisma/client';

@ApiTags('Certification & Examination Architecture')
@Controller()
export class CertificationsController {
  constructor(private readonly certsService: CertificationsService) { }

  @ApiOperation({ summary: 'List all active professional certification definitions' })
  @Get('certifications')
  async listCertifications() {
    return this.certsService.listCertifications();
  }

  @ApiOperation({ summary: 'Get details & requirements of a specific certification' })
  @Get('certifications/:code')
  async getCertificationByCode(@Param('code') code: string) {
    return this.certsService.getCertificationByCode(code);
  }

  @ApiOperation({ summary: 'Calculate certification eligibility for authenticated learner' })
  @UseGuards(JwtAuthGuard)
  @Get('certifications/:code/eligibility')
  async calculateEligibility(
    @Req() req: any,
    @Param('code') code: string
  ) {
    return this.certsService.calculateEligibility(req.user.id, code);
  }

  @ApiOperation({ summary: 'Start a final theory certification exam attempt' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/theory/start')
  async startTheoryExam(
    @Req() req: any,
    @Body() dto: { certificationCode?: string }
  ) {
    const code = dto.certificationCode || 'NV-NET';
    return this.certsService.startExamAttempt(req.user.id, {
      certificationCode: code,
      type: ExamType.THEORY,
    });
  }

  @ApiOperation({ summary: 'Get active theory exam attempt details and public-safe questions' })
  @UseGuards(JwtAuthGuard)
  @Get('exams/theory/:attemptId')
  async getTheoryExamAttempt(
    @Req() req: any,
    @Param('attemptId') attemptId: string
  ) {
    return this.certsService.getAttemptStatus(req.user.id, attemptId);
  }

  @ApiOperation({ summary: 'Record incremental answer choice for a theory exam question' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/theory/:attemptId/answer')
  async answerTheoryQuestion(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: AnswerQuestionDto
  ) {
    return this.certsService.answerQuestion(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Finalize and submit a final theory exam attempt' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/theory/:attemptId/submit')
  async submitTheoryExam(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitExamAttemptDto
  ) {
    return this.certsService.submitExamAttempt(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Start a final practical network certification exam attempt' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/practical/start')
  async startPracticalExam(
    @Req() req: any,
    @Body() dto: { certificationCode?: string }
  ) {
    const code = dto.certificationCode || 'NV-NET';
    return this.certsService.startExamAttempt(req.user.id, {
      certificationCode: code,
      type: ExamType.PRACTICAL,
    });
  }

  @ApiOperation({ summary: 'Get active practical exam attempt details and topology state' })
  @UseGuards(JwtAuthGuard)
  @Get('exams/practical/:attemptId')
  async getPracticalExamAttempt(
    @Req() req: any,
    @Param('attemptId') attemptId: string
  ) {
    return this.certsService.getAttemptStatus(req.user.id, attemptId);
  }

  @ApiOperation({ summary: 'Execute diagnostic command or remediation fix on troubleshooting incident' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/practical/:attemptId/troubleshoot')
  async executeTroubleshootingAction(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: any
  ) {
    return this.certsService.executeTroubleshootingAction(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Record incremental answer choice for packet/protocol analysis question' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/practical/:attemptId/packet-answer')
  async answerPacketQuestion(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: any
  ) {
    return this.certsService.answerPacketQuestion(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Claim official professional certification certificate after passing required exams' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('certifications/:code/claim-certificate')
  async claimCertificationCertificate(
    @Req() req: any,
    @Param('code') code: string
  ) {
    return this.certsService.claimCertificationCertificate(req.user.id, code);
  }

  @ApiOperation({ summary: 'Publicly verify a professional certification or credential by ID / code' })
  @Get('certificates/verify/:credentialId')
  async verifyCertificate(
    @Param('credentialId') credentialId: string
  ) {
    return this.certsService.verifyCertificate(credentialId);
  }

  @ApiOperation({ summary: 'Download official certificate PDF document (Authorized Owner Only)' })
  @UseGuards(JwtAuthGuard)
  @Get('certificates/:id/download')
  async downloadCertificate(
    @Req() req: any,
    @Param('id') id: string,
    @Res() res: any
  ) {
    const { buffer, filename, contentType } = await this.certsService.generateCertificateDownload(req.user.id, id);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length.toString());
    res.status(200).send(buffer);
  }

  @ApiOperation({ summary: 'Execute state configuration or diagnostic action on practical exam topology' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/practical/:attemptId/action')
  async executePracticalAction(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: any
  ) {
    return this.certsService.executePracticalAction(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Request objective hint for practical exam attempt (5% penalty per hint)' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/practical/:attemptId/hint')
  async requestPracticalHint(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: any
  ) {
    return this.certsService.requestPracticalHint(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Finalize and submit a final practical network exam attempt' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/practical/:attemptId/submit')
  async submitPracticalExam(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitExamAttemptDto
  ) {
    return this.certsService.submitExamAttempt(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Start a final certification exam attempt (Generic)' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/start')
  async startExamAttempt(
    @Req() req: any,
    @Body() dto: StartExamAttemptDto
  ) {
    return this.certsService.startExamAttempt(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Submit an active final certification exam attempt (Generic)' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('exams/:attemptId/submit')
  async submitExamAttempt(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitExamAttemptDto
  ) {
    return this.certsService.submitExamAttempt(req.user.id, attemptId, dto);
  }

  @ApiOperation({ summary: 'Get status & telemetry of an exam attempt (Generic)' })
  @UseGuards(JwtAuthGuard)
  @Get('exams/:attemptId/status')
  async getAttemptStatus(
    @Req() req: any,
    @Param('attemptId') attemptId: string
  ) {
    return this.certsService.getAttemptStatus(req.user.id, attemptId);
  }
}
