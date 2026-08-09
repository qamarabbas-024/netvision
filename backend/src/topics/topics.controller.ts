import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
import { ToggleSaveLessonDto } from './dto/toggle-save-lesson.dto';
import { SubmitLabDto } from './dto/submit-lab.dto';
import { ExecuteLabCommandDto } from './dto/execute-lab-command.dto';
import { ValidateLabDto } from './dto/validate-lab.dto';
import { ClaimProgressDto } from './dto/claim-progress.dto';
import { ClaimCertificateDto } from './dto/claim-certificate.dto';
import { CourseLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { LearnerIdentity, LearnerIdentityContext } from '../auth/decorators/learner-identity.decorator';

@ApiTags('courses', 'topics', 'lessons', 'quizzes', 'labs', 'search', 'progress', 'learners')
@Controller()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiOperation({ summary: 'Search across courses, lessons, and modules' })
  @Get('search')
  async search(@Query('q') q: string) {
    return this.topicsService.search(q || '');
  }

  @ApiOperation({ summary: 'Get all curriculum topics & courses' })
  @ApiQuery({ name: 'level', enum: CourseLevel, required: false })
  @ApiQuery({ name: 'category', type: String, required: false })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('courses')
  async getCourses(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Query('level') level?: CourseLevel,
    @Query('category') category?: string
  ) {
    return this.topicsService.getCourses(identity.userId || undefined, level, category);
  }

  @ApiOperation({ summary: 'Get topic or course by slug' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('courses/:slug')
  async getCourseBySlug(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('slug') slug: string
  ) {
    return this.topicsService.getCourseBySlug(slug, identity.userId || undefined);
  }

  @ApiOperation({ summary: 'Alias route: Get all learning topics' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('topics')
  async getTopics(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Query('level') level?: CourseLevel,
    @Query('category') category?: string
  ) {
    return this.topicsService.getCourses(identity.userId || undefined, level, category);
  }

  @ApiOperation({ summary: 'Alias route: Get topic by ID or slug' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('topics/:slug')
  async getTopicBySlug(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('slug') slug: string
  ) {
    return this.topicsService.getCourseBySlug(slug, identity.userId || undefined);
  }

  @ApiOperation({ summary: 'Get full lesson details by slug' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('lessons/:slug')
  async getLessonBySlug(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('slug') slug: string
  ) {
    return this.topicsService.getLessonBySlug(slug, identity.userId || undefined);
  }

  @ApiOperation({ summary: 'Get quiz details and questions' })
  @Get('quizzes/:id')
  async getQuizById(@Param('id') id: string) {
    return this.topicsService.getQuizById(id);
  }

  @ApiOperation({ summary: 'Submit quiz answers and evaluate score server-side' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('quizzes/:id/submit')
  async submitQuiz(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Param('id') id: string,
    @Body() dto: SubmitQuizDto
  ) {
    return this.topicsService.submitQuiz(id, dto, identity);
  }

  @ApiOperation({ summary: 'Get lab details by ID or slug' })
  @Get('labs/:id')
  async getLabDetails(@Param('id') id: string) {
    return this.topicsService.getLabDetails(id);
  }

  @ApiOperation({ summary: 'Safely execute command in simulated lab environment' })
  @HttpCode(HttpStatus.OK)
  @Post('labs/execute')
  async executeLabCommand(@Body() dto: ExecuteLabCommandDto) {
    return this.topicsService.executeLabCommand(dto);
  }

  @ApiOperation({ summary: 'Validate lab attempt and calculate score' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('labs/validate')
  async validateLab(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: ValidateLabDto
  ) {
    return this.topicsService.validateLab(identity, dto);
  }

  @ApiOperation({ summary: 'Get all network commands with OS, category, and search filters' })
  @ApiQuery({ name: 'os', type: String, required: false })
  @ApiQuery({ name: 'category', type: String, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  @Get('commands')
  async getAllCommands(
    @Query('os') os?: string,
    @Query('category') category?: string,
    @Query('q') q?: string,
  ) {
    return this.topicsService.getAllCommands(os, category, q);
  }

  @ApiOperation({ summary: 'Get detailed command specification by ID or command string' })
  @Get('commands/:id')
  async getCommandById(@Param('id') id: string) {
    return this.topicsService.getCommandById(id);
  }

  @ApiOperation({ summary: 'Submit lab attempt (legacy alias)' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/lab-attempt')
  async submitLabAttempt(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: SubmitLabDto
  ) {
    return this.topicsService.validateLab(identity, { labId: dto.labId, userSolution: dto.userSolution });
  }

  @ApiOperation({ summary: 'Mark lesson as started for user or anonymous guest' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/start')
  async startLesson(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: CompleteLessonDto
  ) {
    return this.topicsService.markLessonStarted(dto.lessonId, identity);
  }

  @ApiOperation({ summary: 'Mark lesson as viewed for user or anonymous guest' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/view')
  async viewLesson(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: CompleteLessonDto
  ) {
    return this.topicsService.markLessonViewed(dto.lessonId, identity);
  }

  @ApiOperation({ summary: 'Mark lesson as complete for user or anonymous guest' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/complete')
  async completeLesson(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: CompleteLessonDto
  ) {
    return this.topicsService.markLessonComplete(dto.lessonId, identity);
  }

  @ApiOperation({ summary: 'Toggle saved bookmark status for a lesson' })
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/save-lesson')
  async toggleSaveLesson(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: ToggleSaveLessonDto
  ) {
    return this.topicsService.toggleSaveLesson(dto.lessonId, identity);
  }

  @ApiOperation({ summary: 'Get user or anonymous guest saved lessons' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('progress/saved-lessons')
  async getSavedLessons(@LearnerIdentity() identity: LearnerIdentityContext) {
    return this.topicsService.getSavedLessons(identity);
  }

  @ApiOperation({ summary: 'Get user or anonymous guest learning progress' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('progress')
  async getUserProgress(@LearnerIdentity() identity: LearnerIdentityContext) {
    return this.topicsService.getUserProgress(identity);
  }

  @ApiOperation({ summary: 'Claim anonymous guest progress into authenticated account' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('learners/claim')
  async claimProgress(@Body() dto: ClaimProgressDto, @Req() req: any) {
    return this.topicsService.claimProgress(req.user.id, dto.anonymousId);
  }

  @ApiOperation({ summary: 'Claim verified course certificate for authenticated account' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('certificates/claim')
  async claimCertificate(@Body() dto: ClaimCertificateDto, @Req() req: any) {
    return this.topicsService.claimCertificate(req.user.id, dto.courseId);
  }

  @ApiOperation({ summary: 'Get certificate details by ID or verification code' })
  @Get('certificates/:id')
  async getCertificateById(@Param('id') id: string) {
    return this.topicsService.getCertificateById(id);
  }
}
