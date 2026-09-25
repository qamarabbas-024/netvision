import { IsString, IsBoolean, IsNumber, IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitLabDto {
  @ApiProperty({ description: 'ID of the LessonLab' })
  @IsString()
  labId: string;

  @ApiPropertyOptional({ description: 'Ignored in zero-trust architecture; score is server-derived' })
  @IsOptional()
  @IsBoolean()
  passed?: boolean;

  @ApiPropertyOptional({ description: 'Ignored in zero-trust architecture; score is server-derived' })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional({ description: 'Array of commands executed during lab session' })
  @IsOptional()
  @IsArray()
  commandHistory?: string[];

  @ApiPropertyOptional({ description: 'Number of hints unlocked' })
  @IsOptional()
  @IsNumber()
  hintsUsedCount?: number;

  @ApiPropertyOptional({ description: 'User topology or command solution payload (audit only)' })
  @IsOptional()
  @IsObject()
  userSolution?: Record<string, any>;
}
