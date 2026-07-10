import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewsletterEmailDto {
  @ApiProperty({ description: 'Email de l\'abonné', example: 'hello@groupearash.com' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;
}
