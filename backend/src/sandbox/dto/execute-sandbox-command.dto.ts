import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ExecuteSandboxCommandDto {
  @ApiProperty({ description: 'Terminal command to execute in sandbox session', example: 'ping 192.168.1.1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  command: string;
}
