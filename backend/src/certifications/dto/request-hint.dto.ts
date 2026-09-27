import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestHintDto {
  @ApiPropertyOptional({ description: 'Specific exam objective identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  objectiveId?: string;

  @ApiPropertyOptional({ description: 'Specific hint identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  hintId?: string;
}
