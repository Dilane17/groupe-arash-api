import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Nom complet de l\'administrateur' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ description: 'Adresse email' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdatePasswordDto {
  @ApiPropertyOptional({ description: 'Mot de passe actuel' })
  @IsString()
  @IsOptional() // Optionnel si on veut forcer le changement sans connaitre l'ancien (cas rare, mais on va le rendre requis en logique ou dto)
  currentPassword?: string;

  @ApiPropertyOptional({ description: 'Nouveau mot de passe' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  newPassword: string;
}
