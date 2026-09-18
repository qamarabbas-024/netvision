import { IsString, IsNotEmpty, IsOptional, IsObject, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExecuteLabCommandDto {
  @ApiProperty({ description: 'ID of the LessonLab' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  labId: string;

  @ApiProperty({ description: 'CLI command entered by user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  command: string;

  @ApiPropertyOptional({ description: 'Current device configuration or topology state' })
  @IsOptional()
  @IsObject()
  currentTopologyState?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Client state version for optimistic concurrency' })
  @IsOptional()
  @IsNumber()
  clientStateVersion?: number;

  @ApiPropertyOptional({ description: 'Active simulation session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
