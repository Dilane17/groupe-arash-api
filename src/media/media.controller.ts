import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MediaType } from '@prisma/client';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les médias (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: MediaType })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste paginée des médias.' })
  findMedia(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: MediaType,
    @Query('category') category?: string,
  ) {
    return this.mediaService.findMedia(page ? +page : 1, limit ? +limit : 20, type, category);
  }

  @Post('upload-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Générer un token d\'upload pour un média (Admin/Editor)' })
  @ApiQuery({ name: 'type', enum: MediaType, required: true })
  @ApiQuery({ name: 'category', type: String, required: true })
  @ApiResponse({ status: 201, description: 'Token généré.' })
  async generateUploadUrl(
    @Body('filename') filename: string,
    @Query('type') type: MediaType,
    @Query('category') category: string,
  ) {
    if (!filename || !type || !category) {
      throw new Error('Le nom du fichier, le type et la catégorie sont requis');
    }

    let allowedContentTypes: string[] = [];
    let maximumSizeInBytes = 10 * 1024 * 1024; // Default 10MB

    switch (type) {
      case 'IMAGE':
        allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp'];
        break;
      case 'VIDEO':
        allowedContentTypes = ['video/mp4', 'video/quicktime'];
        maximumSizeInBytes = 100 * 1024 * 1024; // 100MB
        break;
      case 'DOCUMENT':
        allowedContentTypes = ['application/pdf'];
        break;
      default:
        throw new Error('Type de média non supporté');
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const safeCategory = category.replace(/[^a-zA-Z0-9-]/g, '_');
    const pathname = `media/${safeCategory}/${Date.now()}-${safeFilename}`;

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowedContentTypes,
      maximumSizeInBytes,
      pathname,
      validUntil: Date.now() + 1000 * 60 * 5, // Valid for 5 minutes
    });

    return { type: 'blob', clientPayload: clientToken };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une référence de média (Admin/Editor)' })
  createMediaItem(@Body() createMediaItemDto: CreateMediaItemDto) {
    return this.mediaService.createMediaItem(createMediaItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un média (Admin/Editor)' })
  deleteMediaItem(@Param('id') id: string) {
    return this.mediaService.deleteMediaItem(id);
  }
}
