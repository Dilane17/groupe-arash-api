import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleCategory } from '@prisma/client';

export class CreateNewsArticleDto {
  @ApiProperty({ description: 'Titre de l\'article', example: 'Nouveau partenariat avec l\'État' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Extrait (max 300 caractères)', example: 'Nous sommes fiers d\'annoncer...' })
  @IsString()
  @IsNotEmpty({ message: 'L\'extrait est requis' })
  @MaxLength(300, { message: 'L\'extrait ne doit pas dépasser 300 caractères' })
  excerpt: string;

  @ApiProperty({ description: 'Contenu complet (HTML ou Markdown)', example: '<p>Le contenu...</p>' })
  @IsString()
  @IsNotEmpty({ message: 'Le contenu est requis' })
  content: string;

  @ApiPropertyOptional({ description: 'URL de l\'image de couverture uploadée', example: 'https://xxx.public.blob.vercel-storage.com/image.jpg' })
  @IsUrl({}, { message: 'L\'URL de l\'image doit être valide' })
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty({ description: 'Catégorie de l\'article', enum: ArticleCategory, example: 'ACTUALITE' })
  @IsEnum(ArticleCategory, { message: 'Catégorie invalide' })
  @IsNotEmpty()
  category: ArticleCategory;
}
