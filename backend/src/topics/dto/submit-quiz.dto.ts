import { IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizDto {
  @ApiProperty({
    description: 'Map of question IDs to selected option index',
    example: { 'q-1': 1, 'q-2': 0 }
  })
  @IsObject()
  @IsNotEmpty()
  answers: Record<string, number>;
}
