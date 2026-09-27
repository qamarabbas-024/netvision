import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum PracticalActionType {
  CONFIGURE_DEVICE = 'configureDevice',
  CONFIGURE_INTERFACE = 'configureInterface',
  CONFIGURE_VLAN = 'configureVlan',
  ADD_ROUTE = 'addRoute',
  UPDATE_ACL = 'updateAcl',
  EXECUTE_COMMAND = 'executeCommand',
}

export class PracticalActionDto {
  @ApiProperty({ enum: PracticalActionType, description: 'Practical topology action to execute' })
  @IsEnum(PracticalActionType, { message: 'Invalid practical action type' })
  @IsNotEmpty()
  action: PracticalActionType;

  @ApiPropertyOptional({ description: 'Target node or device identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nodeId?: string;

  @ApiPropertyOptional({ description: 'Configuration payload object' })
  @IsOptional()
  payload?: any;
}
