import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UnlockAchievementDto {
  @ApiProperty({ description: 'Unique achievement slug identifier', example: 'FIRST_LOGIN' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;
}
