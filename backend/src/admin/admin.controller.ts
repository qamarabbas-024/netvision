import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
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
  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
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

