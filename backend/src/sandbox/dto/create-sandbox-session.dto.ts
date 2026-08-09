import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateSandboxSessionDto {
  @ApiPropertyOptional({ description: 'Target lab ID to initialize network topology for' })
  @IsOptional()
  @IsString()
  labId?: string;

  @ApiPropertyOptional({ description: 'Sandbox session lifetime in minutes', default: 30 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(180)
  durationMinutes?: number = 30;

  @ApiPropertyOptional({ description: 'Sandbox provider implementation', default: 'SIMULATED' })
  @IsOptional()
  @IsString()
  providerType?: 'SIMULATED' | 'DOCKER' = 'SIMULATED';
}
