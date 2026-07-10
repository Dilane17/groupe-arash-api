import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartnerCategory } from '@prisma/client';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Nom du partenaire', example: 'Microsoft' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @ApiProperty({ description: 'URL du logo uploadé', example: 'https://xxx.public.blob.vercel-storage.com/logo.png' })
  @IsUrl({}, { message: 'L\'URL du logo doit être valide' })
  @IsNotEmpty({ message: 'Le logo est requis' })
  logoUrl: string;

  @ApiPropertyOptional({ description: 'Site web du partenaire', example: 'https://microsoft.com' })
  @IsUrl({}, { message: 'L\'URL du site web doit être valide' })
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ description: 'Catégorie du partenaire', enum: PartnerCategory, example: 'TECHNIQUE' })
  @IsEnum(PartnerCategory, { message: 'Catégorie invalide' })
  @IsNotEmpty()
  category: PartnerCategory;

  @ApiPropertyOptional({ description: 'Ordre d\'affichage (tri ascendant)', example: 10 })
  @IsInt()
  @IsOptional()
  order?: number;
}
