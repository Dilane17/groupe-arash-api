import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import slugify from 'slugify';
import { ArticleCategory } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.newsArticle.findUnique({ where: { slug } });
      if (!existing) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  async createArticle(dto: CreateNewsArticleDto, authorId: string) {
    const slug = await this.generateUniqueSlug(dto.title);
    return this.prisma.newsArticle.create({
      data: {
        ...dto,
        slug,
        authorId,
        isPublished: false,
      },
    });
  }

  async updateArticle(id: string, dto: UpdateNewsArticleDto) {
    const article = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article introuvable');

    let slug = article.slug;
    if (dto.title && dto.title !== article.title) {
      slug = await this.generateUniqueSlug(dto.title);
    }

    return this.prisma.newsArticle.update({
      where: { id },
      data: { ...dto, slug },
    });
  }

  async publishArticle(id: string) {
    const article = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article introuvable');

    return this.prisma.newsArticle.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: article.publishedAt || new Date(),
      },
    });
  }

  async deleteArticle(id: string) {
    const article = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article introuvable');

    return this.prisma.newsArticle.delete({ where: { id } });
  }

  async findPublishedArticles(page: number = 1, limit: number = 10, category?: ArticleCategory) {
    const skip = (page - 1) * limit;
    
    const where: any = { isPublished: true };
    if (category) {
      where.category = category;
    }

    const [total, articles] = await Promise.all([
      this.prisma.newsArticle.count({ where }),
      this.prisma.newsArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { author: { select: { name: true } } },
      }),
    ]);

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findArticleBySlug(slug: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });

    if (!article || !article.isPublished) {
      throw new NotFoundException('Article introuvable ou non publié');
    }

    return article;
  }

  async findAllArticlesAdmin() {
    return this.prisma.newsArticle.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    });
  }
}
