import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

export interface LearnerIdentityInput {
  userId?: string | null;
  anonymousId?: string | null;
}

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureAnonymousLearner(anonymousId?: string | null, tx?: Prisma.TransactionClient) {
    if (!anonymousId) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(anonymousId)) {
      throw new BadRequestException(`Invalid anonymousId format "${anonymousId}". Must be a valid UUID.`);
    }
    const client = tx || this.prisma;
    return await client.anonymousLearner.upsert({
      where: { id: anonymousId },
      update: {},
      create: { id: anonymousId },
    });
  }

  /**
   * Returns all active available achievements in the catalog.
   */
  async getAvailableAchievements() {
    const achievements = await this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: [{ points: 'asc' }, { title: 'asc' }],
    });

    return achievements.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      badgeIcon: a.badgeIcon,
      category: a.category,
      points: a.points,
      criteria: a.criteriaJson,
    }));
  }

  /**
   * Returns all achievements (both active and reserved) with earned status for an identity.
   */
  async getUserAchievements(identity: LearnerIdentityInput) {
    const userId = identity.userId || null;
    const anonymousId = identity.anonymousId || null;

    if (!userId && !anonymousId) {
      throw new BadRequestException('Learner identity (userId or anonymousId) is required.');
    }

    const achievements = await this.prisma.achievement.findMany({
      orderBy: [{ points: 'asc' }, { title: 'asc' }],
    });

    let unlockedRecords: Array<{ achievementId: string; unlockedAt: Date }> = [];

    if (userId || anonymousId) {
      unlockedRecords = await this.prisma.userAchievement.findMany({
        where: userId ? { userId } : { anonymousId: anonymousId! },
        select: { achievementId: true, unlockedAt: true },
      });
    }

    const unlockedMap = unlockedRecords.reduce((acc, r) => {
      acc[r.achievementId] = r.unlockedAt;
      return acc;
    }, {} as Record<string, Date>);

    let totalPointsEarned = 0;

    const items = achievements.map((a) => {
      const isUnlocked = Boolean(unlockedMap[a.id]);
      if (isUnlocked) {
        totalPointsEarned += a.points;
      }

      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        description: a.description,
        badgeIcon: a.badgeIcon,
        category: a.category,
        points: a.points,
        isActive: a.isActive,
        unlocked: isUnlocked,
        unlockedAt: unlockedMap[a.id] || null,
      };
    });

    const unlockedCount = items.filter((i) => i.unlocked).length;

    return {
      totalAchievements: achievements.length,
      unlockedCount,
      totalPointsEarned,
      achievements: items,
    };
  }

  /**
   * Checks whether an identity has earned a specific achievement.
   */
  async hasAchievement(identity: LearnerIdentityInput, achievementSlug: string): Promise<boolean> {
    const userId = identity.userId || null;
    const anonymousId = identity.anonymousId || null;

    if (!userId && !anonymousId) return false;

    const achievement = await this.prisma.achievement.findUnique({
      where: { slug: achievementSlug },
    });

    if (!achievement) return false;

    const existing = await this.prisma.userAchievement.findFirst({
      where: userId
        ? { userId, achievementId: achievement.id }
        : { anonymousId: anonymousId!, achievementId: achievement.id },
    });

    return Boolean(existing);
  }

  /**
   * Idempotently awards an achievement to a learner inside an optional Prisma transaction.
   */
  async awardAchievement(
    identity: LearnerIdentityInput,
    achievementSlug: string,
    tx?: Prisma.TransactionClient
  ) {
    const userId = identity.userId || null;
    const anonymousId = identity.anonymousId || null;

    if (!userId && !anonymousId) {
      throw new BadRequestException('Learner identity (userId or anonymousId) is required to award achievements.');
    }

    const client = tx || this.prisma;

    if (!userId && anonymousId) {
      await this.ensureAnonymousLearner(anonymousId, client);
    }

    const achievement = await client.achievement.findUnique({
      where: { slug: achievementSlug },
    });

    if (!achievement) {
      throw new NotFoundException(`Achievement badge with slug "${achievementSlug}" not found.`);
    }

    if (!achievement.isActive) {
      // Reserved achievement — cannot be awarded yet
      return {
        awarded: false,
        reason: 'RESERVED_ACHIEVEMENT',
        achievement: {
          id: achievement.id,
          slug: achievement.slug,
          title: achievement.title,
        },
      };
    }

    const existing = await client.userAchievement.findFirst({
      where: userId
        ? { userId, achievementId: achievement.id }
        : { anonymousId: anonymousId!, achievementId: achievement.id },
    });

    if (existing) {
      return {
        awarded: false,
        alreadyEarned: true,
        achievement: {
          id: achievement.id,
          slug: achievement.slug,
          title: achievement.title,
          badgeIcon: achievement.badgeIcon,
          points: achievement.points,
        },
        earnedAt: existing.unlockedAt,
      };
    }

    const created = await client.userAchievement.create({
      data: {
        userId,
        anonymousId: userId ? null : anonymousId,
        achievementId: achievement.id,
      },
    });

    return {
      awarded: true,
      alreadyEarned: false,
      achievement: {
        id: achievement.id,
        slug: achievement.slug,
        title: achievement.title,
        badgeIcon: achievement.badgeIcon,
        points: achievement.points,
      },
      earnedAt: created.unlockedAt,
    };
  }
}
