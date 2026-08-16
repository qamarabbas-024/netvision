import { Module } from '@nestjs/common';
import { TroubleshootingController } from './troubleshooting.controller';
import { TroubleshootingService } from './troubleshooting.service';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [AchievementsModule],
  controllers: [TroubleshootingController],
  providers: [TroubleshootingService],
  exports: [TroubleshootingService],
})
export class TroubleshootingModule {}
