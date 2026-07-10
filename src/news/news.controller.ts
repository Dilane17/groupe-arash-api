import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ArticleCategory } from '@prisma/client';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les articles publiés (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, enum: ArticleCategory })
  @ApiResponse({ status: 200, description: 'Liste paginée des articles.' })
  findPublishedArticles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: ArticleCategory,
  ) {
    return this.newsService.findPublishedArticles(page ? +page : 1, limit ? +limit : 10, category);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Détail d\'un article publié via slug (Public)' })
  @ApiResponse({ status: 200, description: 'Détail de l\'article.' })
  findArticleBySlug(@Param('slug') slug: string) {
    return this.newsService.findArticleBySlug(slug);
  }

  @Post('upload-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Générer un token d\'upload pour l\'image de couverture (Admin/Editor)' })
  @ApiResponse({ status: 201, description: 'Token généré.' })
  async generateUploadUrl(@Body('filename') filename: string) {
    if (!filename) {
      throw new Error('Le nom du fichier est requis');
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = `news/${Date.now()}-${safeFilename}`;

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowedContentTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
      ],
      maximumSizeInBytes: 5 * 1024 * 1024, // 5 MB
      pathname,
      validUntil: Date.now() + 1000 * 60 * 5, // Valid for 5 minutes
    });

    return { type: 'blob', clientPayload: clientToken };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un article (Admin/Editor)' })
  createArticle(@Body() createNewsArticleDto: CreateNewsArticleDto, @CurrentUser() user: any) {
    return this.newsService.createArticle(createNewsArticleDto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un article (Admin/Editor)' })
  updateArticle(@Param('id') id: string, @Body() updateNewsArticleDto: UpdateNewsArticleDto) {
    return this.newsService.updateArticle(id, updateNewsArticleDto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publier un article (Admin/Editor)' })
  publishArticle(@Param('id') id: string) {
    return this.newsService.publishArticle(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un article (Admin seulement)' })
  deleteArticle(@Param('id') id: string) {
    return this.newsService.deleteArticle(id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister tous les articles (Admin/Editor)' })
  findAllArticlesAdmin() {
    return this.newsService.findAllArticlesAdmin();
  }
}
