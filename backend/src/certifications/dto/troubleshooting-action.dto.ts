import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum TroubleshootingActionType {
  EXECUTE_COMMAND = 'executeCommand',
  APPLY_FIX = 'applyFix',
}

export class TroubleshootingActionDto {
  @ApiProperty({ enum: TroubleshootingActionType, description: 'Action type to perform' })
  @IsEnum(TroubleshootingActionType, { message: 'action must be either executeCommand or applyFix' })
  @IsNotEmpty()
  action: TroubleshootingActionType;

  @ApiPropertyOptional({ description: 'Terminal command to execute in scenario' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  command?: string;

  @ApiPropertyOptional({ description: 'Remediation fix identifier to apply' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  remediationAction?: string;

  @ApiPropertyOptional({ description: 'Incident ID being resolved' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  incidentId?: string;
}
