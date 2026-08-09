import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimCertificateDto {
  @ApiProperty({ description: 'Course ID or slug for certificate claim', example: 'networking-fundamentals' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
