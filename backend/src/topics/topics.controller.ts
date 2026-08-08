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
import { CourseLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('courses', 'topics', 'lessons', 'quizzes', 'search', 'progress')
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
  @Get('courses')
  async getCourses(
    @Query('level') level?: CourseLevel,
    @Query('category') category?: string,
    @Req() req?: any
  ) {
    const userId = req?.user?.id;
    return this.topicsService.getCourses(userId, level, category);
  }

  @ApiOperation({ summary: 'Get topic or course by slug' })
  @Get('courses/:slug')
  async getCourseBySlug(@Param('slug') slug: string, @Req() req?: any) {
    const userId = req?.user?.id;
    return this.topicsService.getCourseBySlug(slug, userId);
  }

  @ApiOperation({ summary: 'Alias route: Get all learning topics' })
  @Get('topics')
  async getTopics(
    @Query('level') level?: CourseLevel,
    @Query('category') category?: string,
    @Req() req?: any
  ) {
    const userId = req?.user?.id;
    return this.topicsService.getCourses(userId, level, category);
  }

  @ApiOperation({ summary: 'Alias route: Get topic by ID or slug' })
  @Get('topics/:slug')
  async getTopicBySlug(@Param('slug') slug: string, @Req() req?: any) {
    const userId = req?.user?.id;
    return this.topicsService.getCourseBySlug(slug, userId);
  }

  @ApiOperation({ summary: 'Get full lesson details by slug' })
  @Get('lessons/:slug')
  async getLessonBySlug(@Param('slug') slug: string, @Req() req?: any) {
    const userId = req?.user?.id;
    return this.topicsService.getLessonBySlug(slug, userId);
  }

  @ApiOperation({ summary: 'Get quiz details and questions' })
  @Get('quizzes/:id')
  async getQuizById(@Param('id') id: string) {
    return this.topicsService.getQuizById(id);
  }

  @ApiOperation({ summary: 'Submit quiz answers and evaluate score server-side' })
  @HttpCode(HttpStatus.OK)
  @Post('quizzes/:id/submit')
  async submitQuiz(
    @Param('id') id: string,
    @Body() dto: SubmitQuizDto,
    @Req() req?: any
  ) {
    const userId = req?.user?.id;
    return this.topicsService.submitQuiz(id, dto, userId);
  }

  @ApiOperation({ summary: 'Mark lesson as complete for authenticated user' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/complete')
  async completeLesson(@Body() dto: CompleteLessonDto, @Req() req: any) {
    return this.topicsService.markLessonComplete(dto.lessonId, req.user.id);
  }

  @ApiOperation({ summary: 'Toggle saved bookmark status for a lesson' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('progress/save-lesson')
  async toggleSaveLesson(@Body() dto: ToggleSaveLessonDto, @Req() req: any) {
    return this.topicsService.toggleSaveLesson(dto.lessonId, req.user.id);
  }

  @ApiOperation({ summary: 'Get user saved lessons' })
  @UseGuards(JwtAuthGuard)
  @Get('progress/saved-lessons')
  async getSavedLessons(@Req() req: any) {
    return this.topicsService.getSavedLessons(req.user.id);
  }

  @ApiOperation({ summary: 'Get user learning progress and attempts' })
  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async getUserProgress(@Req() req: any) {
    return this.topicsService.getUserProgress(req.user.id);
  }
}
