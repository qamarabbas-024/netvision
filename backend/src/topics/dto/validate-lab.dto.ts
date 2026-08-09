import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateLabDto {
  @ApiProperty({ description: 'ID of the LessonLab' })
  @IsString()
  @IsNotEmpty()
  labId: string;

  @ApiPropertyOptional({ description: 'Array of commands executed during lab session' })
  @IsOptional()
  @IsArray()
  commandHistory?: string[];

  @ApiPropertyOptional({ description: 'Number of hints unlocked' })
  @IsOptional()
  @IsNumber()
  hintsUsedCount?: number;

  @ApiPropertyOptional({ description: 'Final user solution topology state' })
  @IsOptional()
  @IsObject()
  userSolution?: Record<string, any>;
}
