import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class StartTroubleshootingSessionDto {
  @ApiProperty({ description: 'Scenario slug or identifier to launch', example: 'ospf-neighbor-down' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  scenarioId: string;
}
