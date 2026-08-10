import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async getAvailableAchievements() {
    return this.achievementsService.getAvailableAchievements();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyAchievements(@Request() req: any) {
    const userId = req.user.id;
    return this.achievementsService.getUserAchievements({ userId });
  }
}
