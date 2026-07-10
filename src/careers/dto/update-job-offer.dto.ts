import { PartialType } from '@nestjs/swagger';
import { CreateJobOfferDto } from './create-job-offer.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {
  @ApiPropertyOptional({ description: 'Statut actif de l\'offre', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
