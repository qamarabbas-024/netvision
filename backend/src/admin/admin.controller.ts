import { Controller, Get, Post, Query, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { DataLifecycleService } from '../database/data-lifecycle.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataLifecycleService: DataLifecycleService,
  ) {}

  @Get('dashboard')
  async getAdminStats() {
    const totalUsers = await this.prisma.user.count();
    const totalCourses = await this.prisma.course.count();
    const totalLessons = await this.prisma.lesson.count();
    const totalAttempts = await this.prisma.quizAttempt.count();

    return {
      totalUsers,
      totalCourses,
      totalLessons,
      totalAttempts,
      status: 'ADMIN_AUTHORIZED',
    };
  }

  @Get('users')
  async getUsers(
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ) {
    let limit = 50;
    let offset = 0;
    if (limitStr !== undefined) {
      const parsedLimit = parseInt(limitStr, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        throw new BadRequestException('Query parameter "limit" must be an integer between 1 and 100.');
      }
      limit = parsedLimit;
    }
    if (offsetStr !== undefined) {
      const parsedOffset = parseInt(offsetStr, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        throw new BadRequestException('Query parameter "offset" must be a non-negative integer.');
      }
      offset = parsedOffset;
    }

    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('lifecycle/audit')
  async getLifecycleAudit() {
    return this.dataLifecycleService.getLifecycleAudit();
  }

  @Post('lifecycle/prune')
  async pruneExpiredData(@Query('dryRun') dryRunQuery?: string, @Body('dryRun') dryRunBody?: boolean) {
    const isDryRun = dryRunQuery === 'true' || dryRunBody === true;
    return this.dataLifecycleService.executeRetentionCleanup({ dryRun: isDryRun });
  }

  @Get('dr/status')
  async getDisasterRecoveryStatus() {
    return this.dataLifecycleService.getDisasterRecoveryStatus();
  }
}

