import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExecuteLabCommandDto {
  @ApiProperty({ description: 'ID of the LessonLab' })
  @IsString()
  @IsNotEmpty()
  labId: string;

  @ApiProperty({ description: 'CLI command entered by user' })
  @IsString()
  @IsNotEmpty()
  command: string;

  @ApiPropertyOptional({ description: 'Current device configuration or topology state' })
  @IsOptional()
  @IsObject()
  currentTopologyState?: Record<string, any>;
}
