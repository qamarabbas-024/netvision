import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject, IsNumber } from 'class-validator';

export class SubmitExamAttemptDto {
  @ApiPropertyOptional({ example: { q1: 0, q2: 2 }, description: 'Record of question ID to chosen option index' })
  @IsOptional()
  @IsObject()
  answersJson?: Record<string, any>;

  @ApiPropertyOptional({ example: { pingsPassed: true }, description: 'Practical topology state validation payload' })
  @IsOptional()
  @IsObject()
  practicalStateJson?: Record<string, any>;

  @ApiPropertyOptional({ example: 0, description: 'Number of hints requested during practical exam' })
  @IsOptional()
  @IsNumber()
  hintsUsed?: number;
}
