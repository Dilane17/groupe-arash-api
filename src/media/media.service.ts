import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { MediaType } from '@prisma/client';
import { del } from '@vercel/blob';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async createMediaItem(dto: CreateMediaItemDto) {
    return this.prisma.mediaItem.create({
      data: dto,
    });
  }

  async deleteMediaItem(id: string) {
    const media = await this.prisma.mediaItem.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Média introuvable');

    // Suppression du blob associé
    if (media.url && media.url.includes('vercel-storage.com')) {
      try {
        await del(media.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (error) {
        console.error('Erreur lors de la suppression du Vercel Blob:', error);
      }
    }

    return this.prisma.mediaItem.delete({ where: { id } });
  }

  async findMedia(page: number = 1, limit: number = 20, type?: MediaType, category?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;

    const [total, media] = await Promise.all([
      this.prisma.mediaItem.count({ where }),
      this.prisma.mediaItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: media,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
