import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CareersService } from './careers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JobApplicationStatus } from '@prisma/client';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

@ApiTags('Careers')
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  // --- JOB OFFERS ---

  @Get()
  @ApiOperation({ summary: 'Lister les offres actives (Public)' })
  @ApiResponse({ status: 200, description: 'Liste des offres actives.' })
  findActiveJobOffers() {
    return this.careersService.findActiveJobOffers();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Détail d\'une offre active via slug (Public)' })
  @ApiResponse({ status: 200, description: 'Détail de l\'offre.' })
  @ApiResponse({ status: 404, description: 'Offre introuvable.' })
  findJobOfferBySlug(@Param('slug') slug: string) {
    return this.careersService.findJobOfferBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une offre (Admin/Editor)' })
  createJobOffer(@Body() createJobOfferDto: CreateJobOfferDto) {
    return this.careersService.createJobOffer(createJobOfferDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une offre (Admin/Editor)' })
  updateJobOffer(@Param('id') id: string, @Body() updateJobOfferDto: UpdateJobOfferDto) {
    return this.careersService.updateJobOffer(id, updateJobOfferDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une offre (Admin seulement)' })
  deleteJobOffer(@Param('id') id: string) {
    return this.careersService.deleteJobOffer(id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister toutes les offres (Admin/Editor)' })
  findAllJobOffersAdmin() {
    return this.careersService.findAllJobOffersAdmin();
  }

  // --- VERCEL BLOB UPLOAD ---

  @Post('upload-url')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 requêtes / 10 min
  @ApiOperation({ summary: 'Générer un token d\'upload pour le CV (Public)' })
  @ApiResponse({ status: 201, description: 'Token généré.' })
  async generateUploadUrl(@Body('filename') filename: string) {
    if (!filename) {
      throw new Error('Le nom du fichier est requis');
    }

    // Sécurisation basique du nom de fichier
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = `cv/${Date.now()}-${safeFilename}`;

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowedContentTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      maximumSizeInBytes: 5 * 1024 * 1024, // 5 MB
      pathname,
      validUntil: Date.now() + 1000 * 60 * 5, // Valid for 5 minutes
    });

    return { type: 'blob', clientPayload: clientToken };
  }

  // --- APPLICATIONS ---

  @Post('apply')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 requêtes / 10 min
  @ApiOperation({ summary: 'Soumettre une candidature (Public)' })
  @ApiResponse({ status: 201, description: 'Candidature enregistrée et emails envoyés.' })
  createApplication(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return this.careersService.createApplication(createJobApplicationDto);
  }

  @Get('applications/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les candidatures (Admin/Editor)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'jobOfferId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: JobApplicationStatus })
  findApplications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('jobOfferId') jobOfferId?: string,
    @Query('status') status?: JobApplicationStatus,
  ) {
    return this.careersService.findApplications(page ? +page : 1, limit ? +limit : 10, jobOfferId, status);
  }

  @Patch('applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une candidature (Admin/Editor)' })
  updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.careersService.updateApplicationStatus(id, updateApplicationStatusDto.status);
  }
}
