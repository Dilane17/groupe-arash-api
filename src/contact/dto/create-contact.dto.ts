import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'Nom complet', example: 'Jean Dupont' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  fullName: string;

  @ApiProperty({ description: 'Email valide', example: 'jean.dupont@example.com' })
  @IsEmail({}, { message: 'L\'email doit être valide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({ description: 'Sujet du message', example: 'Demande de partenariat' })
  @IsString()
  @IsNotEmpty({ message: 'Le sujet est requis' })
  @MinLength(3, { message: 'Le sujet doit contenir au moins 3 caractères' })
  subject: string;

  @ApiProperty({ description: 'Contenu du message', example: 'Bonjour, je souhaite...' })
  @IsString()
  @IsNotEmpty({ message: 'Le message est requis' })
  @MinLength(10, { message: 'Le message doit contenir au moins 10 caractères' })
  @MaxLength(2000, { message: 'Le message ne doit pas dépasser 2000 caractères' })
  message: string;
}
