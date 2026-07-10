import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';

export class CreateMediaItemDto {
  @ApiProperty({ description: 'Titre du média', example: 'Photo de l\'installation' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title: string;

  @ApiProperty({ description: 'Type de média', enum: MediaType, example: 'IMAGE' })
  @IsEnum(MediaType, { message: 'Type de média invalide' })
  @IsNotEmpty()
  type: MediaType;

  @ApiProperty({ description: 'Catégorie (ex: installations, produits, evenements)', example: 'installations' })
  @IsString()
  @IsNotEmpty({ message: 'La catégorie est requise' })
  category: string;

  @ApiProperty({ description: 'URL du média uploadé', example: 'https://xxx.public.blob.vercel-storage.com/image.jpg' })
  @IsUrl({}, { message: 'L\'URL du média doit être valide' })
  @IsNotEmpty({ message: 'L\'URL est requise' })
  url: string;
}
