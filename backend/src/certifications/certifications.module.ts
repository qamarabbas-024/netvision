import { Module } from '@nestjs/common';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';
import { CertificationEligibilityService } from './certification-eligibility.service';
import { MasterCapstoneService } from './master-capstone.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CertificationsController],
  providers: [CertificationsService, CertificationEligibilityService, MasterCapstoneService],
  exports: [CertificationsService, CertificationEligibilityService, MasterCapstoneService],
})
export class CertificationsModule {}
