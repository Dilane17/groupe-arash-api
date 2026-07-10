import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '@prisma/client';

export class CreateJobOfferDto {
  @ApiProperty({ description: 'Titre du poste', example: 'Développeur Fullstack React/Node' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Département', example: 'IT & Engineering' })
  @IsString()
  @IsNotEmpty({ message: 'Le département est requis' })
  department: string;

  @ApiProperty({ description: 'Lieu du poste', example: 'Paris, France' })
  @IsString()
  @IsNotEmpty({ message: 'La localisation est requise' })
  location: string;

  @ApiProperty({ description: 'Type de contrat', enum: JobType, example: 'CDI' })
  @IsEnum(JobType, { message: 'Type de contrat invalide' })
  @IsNotEmpty()
  type: JobType;

  @ApiProperty({ description: 'Description du poste', example: 'Nous recherchons...' })
  @IsString()
  @IsNotEmpty({ message: 'La description est requise' })
  description: string;

  @ApiProperty({ description: 'Pré-requis', example: '- 3 ans d\'expérience...' })
  @IsString()
  @IsNotEmpty({ message: 'Les pré-requis sont requis' })
  requirements: string;
}
