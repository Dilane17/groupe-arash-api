import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobApplicationStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @ApiProperty({ description: 'Nouveau statut de la candidature', enum: JobApplicationStatus, example: 'REVIEWED' })
  @IsEnum(JobApplicationStatus, { message: 'Le statut doit être RECEIVED, REVIEWED, REJECTED ou ACCEPTED' })
  @IsNotEmpty()
  status: JobApplicationStatus;
}
