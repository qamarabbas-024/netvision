import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UnlockLabHintDto {
  @ApiPropertyOptional({ description: 'Active simulator session identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  sessionId?: string;
}
