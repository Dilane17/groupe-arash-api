import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ContactMessageStatus } from '@prisma/client';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 requests per 10 minutes (600000 ms)
  @ApiOperation({ summary: 'Envoyer un message de contact (Public)' })
  @ApiResponse({ status: 201, description: 'Message enregistré et emails envoyés.', schema: { example: { success: true, id: 'cuid123' } } })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 429, description: 'Trop de requêtes (Rate limiting).' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les messages de contact (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ContactMessageStatus })
  @ApiResponse({ status: 200, description: 'Liste paginée des messages.' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ContactMessageStatus,
  ) {
    return this.contactService.findAll(page ? +page : 1, limit ? +limit : 10, status);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un message (Admin)' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  updateStatus(@Param('id') id: string, @Body() updateContactStatusDto: UpdateContactStatusDto) {
    return this.contactService.updateStatus(id, updateContactStatusDto.status);
  }
}
