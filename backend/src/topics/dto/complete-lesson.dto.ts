import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteLessonDto {
  @ApiProperty({
    description: 'Lesson ID or Lesson Slug to mark completed',
    example: 'what-is-a-computer-network'
  })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}
