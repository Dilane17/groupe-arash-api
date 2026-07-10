import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactMessageStatus } from '@prisma/client';

export class UpdateContactStatusDto {
  @ApiProperty({ description: 'Nouveau statut du message', enum: ContactMessageStatus, example: 'READ' })
  @IsEnum(ContactMessageStatus, { message: 'Le statut doit être NEW, READ ou ARCHIVED' })
  @IsNotEmpty()
  status: ContactMessageStatus;
}
