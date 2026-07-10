import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerCategory } from '@prisma/client';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPartner(dto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: {
        ...dto,
        order: dto.order ?? 0,
      },
    });
  }

  async updatePartner(id: string, dto: UpdatePartnerDto) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Partenaire introuvable');

    return this.prisma.partner.update({
      where: { id },
      data: dto,
    });
  }

  async deletePartner(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Partenaire introuvable');

    return this.prisma.partner.delete({ where: { id } });
  }

  async findActivePartners(category?: PartnerCategory) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    return this.prisma.partner.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findAllPartnersAdmin() {
    return this.prisma.partner.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }
}
