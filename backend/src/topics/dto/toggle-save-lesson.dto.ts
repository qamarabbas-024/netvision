import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleSaveLessonDto {
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}
