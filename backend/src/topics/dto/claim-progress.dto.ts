import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimProgressDto {
  @ApiProperty({ description: 'Anonymous Learner UUID generated client-side', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  anonymousId: string;
}
