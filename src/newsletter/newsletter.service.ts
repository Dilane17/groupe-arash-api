import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewsletterEmailDto } from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: NewsletterEmailDto) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      if (existing.isActive) {
        return { success: true };
      } else {
        await this.prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });
        return { success: true };
      }
    }

    await this.prisma.newsletterSubscriber.create({
      data: {
        email: dto.email,
      },
    });

    return { success: true };
  }

  async unsubscribe(dto: NewsletterEmailDto) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    });

    if (existing && existing.isActive) {
      await this.prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
        },
      });
    }

    return { success: true };
  }

  async getSubscribers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.newsletterSubscriber.count({
        where: { isActive: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async exportSubscribers(): Promise<string> {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
      select: { email: true, subscribedAt: true },
    });

    const header = 'email,subscribedAt\n';
    const rows = subscribers
      .map((s) => `${s.email},${s.subscribedAt.toISOString()}`)
      .join('\n');
    return header + rows;
  }
}
