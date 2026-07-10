import { PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiPropertyOptional({ description: 'Statut actif du partenaire', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
