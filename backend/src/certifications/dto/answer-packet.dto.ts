import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class AnswerPacketDto {
  @ApiProperty({ description: 'Packet analysis question identifier' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  questionId: string;

  @ApiProperty({ description: 'Zero-based index of the chosen multiple-choice option' })
  @IsInt()
  @Min(0)
  @Max(10)
  selectedOption: number;
}
