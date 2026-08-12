import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ExamType } from '@prisma/client';

export class StartExamAttemptDto {
  @ApiProperty({ example: 'NV-NET', description: 'Certification code e.g. NV-NET' })
  @IsNotEmpty()
  @IsString()
  certificationCode: string;

  @ApiProperty({ enum: ExamType, example: ExamType.THEORY, description: 'Exam type: THEORY or PRACTICAL' })
  @IsNotEmpty()
  @IsEnum(ExamType)
  type: ExamType;
}
