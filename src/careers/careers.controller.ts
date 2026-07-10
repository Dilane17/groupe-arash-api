import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
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
import { put } from '@vercel/blob';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('upload')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 15, ttl: 300000 } }) // 15 requêtes / 5 min
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploader un CV directement (Public)' })
  @ApiResponse({ status: 201, description: 'CV uploadé.' })
  async uploadCv(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Sécurisation basique du nom de fichier
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = `cv/${Date.now()}-${safeFilename}`;

    try {
      const blob = await put(pathname, file.buffer, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return { success: true, url: blob.url };
    } catch (error) {
      console.error("Vercel Blob Upload Error:", error);
      return { success: false, message: error.message || error.toString() };
    }
  }

  // --- APPLICATIONS ---

  @Post('apply')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 15, ttl: 300000 } }) // 15 requêtes / 5 min
  @ApiOperation({ summary: 'Soumettre une candidature (Public)' })
  @ApiResponse({ status: 201, description: 'Candidature enregistrée et emails envoyés.' })
  async createApplication(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    try {
      return await this.careersService.createApplication(createJobApplicationDto);
    } catch (e) {
      console.error("ERROR IN createApplication:", e);
      return { success: false, message: e.message || e.toString() };
    }
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
