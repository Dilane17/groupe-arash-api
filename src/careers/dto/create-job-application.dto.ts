import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobApplicationDto {
  @ApiPropertyOptional({ description: 'ID de l\'offre (null si candidature spontanée)', example: 'cuid123' })
  @IsString()
  @IsOptional()
  jobOfferId?: string;

  @ApiProperty({ description: 'Nom complet du candidat', example: 'Marie Dupont' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  fullName: string;

  @ApiProperty({ description: 'Email du candidat', example: 'marie.dupont@example.com' })
  @IsEmail({}, { message: 'L\'email doit être valide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: '+33 6 12 34 56 78' })
  @IsString()
  @IsNotEmpty({ message: 'Le téléphone est requis' })
  phone: string;

  @ApiPropertyOptional({ description: 'Message ou lettre de motivation', example: 'Je suis très intéressée...' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'URL du CV uploadé sur Vercel Blob', example: 'https://xxx.public.blob.vercel-storage.com/cv.pdf' })
  @IsUrl({}, { message: 'L\'URL du CV doit être valide' })
  @IsNotEmpty({ message: 'Le CV est requis' })
  cvUrl: string;
}
