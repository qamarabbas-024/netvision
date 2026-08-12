import { Controller, Get, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { LearnerIdentity, LearnerIdentityContext } from '../auth/decorators/learner-identity.decorator';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async getAvailableAchievements() {
    return this.achievementsService.getAvailableAchievements();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('me')
  async getMyAchievementsMe(@LearnerIdentity() identity: LearnerIdentityContext) {
    if (!identity.userId && !identity.anonymousId) {
      throw new UnauthorizedException('Authentication token or X-Anonymous-ID header is required.');
    }
    return this.achievementsService.getUserAchievements({
      userId: identity.userId,
      anonymousId: identity.anonymousId,
    });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('my')
  async getMyAchievementsMy(@LearnerIdentity() identity: LearnerIdentityContext) {
    if (!identity.userId && !identity.anonymousId) {
      throw new UnauthorizedException('Authentication token or X-Anonymous-ID header is required.');
    }
    return this.achievementsService.getUserAchievements({
      userId: identity.userId,
      anonymousId: identity.anonymousId,
    });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('unlock')
  async unlockAchievement(
    @LearnerIdentity() identity: LearnerIdentityContext,
    @Body() dto: { slug: string }
  ) {
    if (!identity.userId && !identity.anonymousId) {
      throw new UnauthorizedException('Authentication token or X-Anonymous-ID header is required.');
    }

    const rawSlug = dto.slug || '';
    const normalizedSlug = rawSlug.toUpperCase().replace(/-/g, '_');

    const result = await this.achievementsService.awardAchievement(
      { userId: identity.userId, anonymousId: identity.anonymousId },
      normalizedSlug
    );

    return {
      unlocked: result.awarded || result.alreadyEarned,
      alreadyUnlocked: result.alreadyEarned || false,
      awarded: result.awarded,
      alreadyEarned: result.alreadyEarned,
      achievement: result.achievement,
      earnedAt: result.earnedAt,
    };
  }
}
