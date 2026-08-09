import { IsString, IsBoolean, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitLabDto {
  @ApiProperty({ description: 'ID of the LessonLab' })
  @IsString()
  labId: string;

  @ApiProperty({ description: 'Whether the lab attempt passed diagnostic validation' })
  @IsBoolean()
  passed: boolean;

  @ApiProperty({ description: 'Score achieved in the lab attempt (0-100)' })
  @IsNumber()
  score: number;

  @ApiPropertyOptional({ description: 'User topology or command solution payload' })
  @IsOptional()
  @IsObject()
  userSolution?: Record<string, any>;
}
