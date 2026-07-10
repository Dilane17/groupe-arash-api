import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PartnerCategory } from '@prisma/client';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

@ApiTags('Partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les partenaires actifs (Public)' })
  @ApiQuery({ name: 'category', required: false, enum: PartnerCategory })
  @ApiResponse({ status: 200, description: 'Liste des partenaires actifs.' })
  findActivePartners(@Query('category') category?: PartnerCategory) {
    return this.partnersService.findActivePartners(category);
  }

  @Post('upload-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Générer un token d\'upload pour le logo (Admin/Editor)' })
  @ApiResponse({ status: 201, description: 'Token généré.' })
  async generateUploadUrl(@Body('filename') filename: string) {
    if (!filename) {
      throw new Error('Le nom du fichier est requis');
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = `partners/${Date.now()}-${safeFilename}`;

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowedContentTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
      ],
      maximumSizeInBytes: 2 * 1024 * 1024, // 2 MB
      pathname,
      validUntil: Date.now() + 1000 * 60 * 5, // Valid for 5 minutes
    });

    return { type: 'blob', clientPayload: clientToken };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un partenaire (Admin/Editor)' })
  createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.createPartner(createPartnerDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un partenaire (Admin/Editor)' })
  updatePartner(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un partenaire (Admin seulement)' })
  deletePartner(@Param('id') id: string) {
    return this.partnersService.deletePartner(id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister tous les partenaires (Admin/Editor)' })
  findAllPartnersAdmin() {
    return this.partnersService.findAllPartnersAdmin();
  }
}
