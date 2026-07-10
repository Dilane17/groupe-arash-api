import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import slugify from 'slugify';
import { JobApplicationStatus } from '@prisma/client';

@Injectable()
export class CareersService {
  private readonly logger = new Logger(CareersService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  // --- JOB OFFERS ---

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.jobOffer.findUnique({ where: { slug } });
      if (!existing) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  async createJobOffer(dto: CreateJobOfferDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    return this.prisma.jobOffer.create({
      data: { ...dto, slug },
    });
  }

  async updateJobOffer(id: string, dto: UpdateJobOfferDto) {
    const offer = await this.prisma.jobOffer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException('Offre introuvable');

    let slug = offer.slug;
    if (dto.title && dto.title !== offer.title) {
      slug = await this.generateUniqueSlug(dto.title);
    }

    return this.prisma.jobOffer.update({
      where: { id },
      data: { ...dto, slug },
    });
  }

  async deleteJobOffer(id: string) {
    const offer = await this.prisma.jobOffer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException('Offre introuvable');

    return this.prisma.jobOffer.delete({ where: { id } });
  }

  async findActiveJobOffers() {
    return this.prisma.jobOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllJobOffersAdmin() {
    return this.prisma.jobOffer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    });
  }

  async findJobOfferBySlug(slug: string) {
    const offer = await this.prisma.jobOffer.findUnique({ where: { slug } });
    if (!offer || !offer.isActive) {
      throw new NotFoundException('Offre introuvable ou inactive');
    }
    return offer;
  }

  // --- APPLICATIONS ---

  async createApplication(dto: CreateJobApplicationDto) {
    let jobTitle = 'Candidature Spontanée';

    if (dto.jobOfferId) {
      const offer = await this.prisma.jobOffer.findUnique({ where: { id: dto.jobOfferId } });
      if (!offer) {
        throw new NotFoundException('L\'offre spécifiée est introuvable');
      }
      jobTitle = `Candidature pour: ${offer.title}`;
    }

    const application = await this.prisma.jobApplication.create({
      data: {
        jobOfferId: dto.jobOfferId || null,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        message: dto.message || '',
        cvUrl: dto.cvUrl,
        status: 'RECEIVED',
      },
    });

    const receiverEmail = this.configService.get<string>('CONTACT_RECEIVER_EMAIL');
    if (receiverEmail) {
      const adminSubject = `Nouvelle ${jobTitle}`;
      const adminText = `Nouveau candidat:\n\nNom: ${dto.fullName}\nEmail: ${dto.email}\nTéléphone: ${dto.phone}\nOffre ID: ${dto.jobOfferId || 'N/A'}\n\nMessage:\n${dto.message || 'Aucun message'}\n\nLien CV: ${dto.cvUrl}`;
      this.emailService.sendEmail(receiverEmail, adminSubject, adminText).catch(err => {
        this.logger.error('Erreur envoi email candidature admin', err);
      });
    }

    const userSubject = `Accusé de réception - ${jobTitle}`;
    const userText = `Bonjour ${dto.fullName},\n\nNous avons bien reçu votre candidature.\nNotre équipe de recrutement étudiera votre profil avec attention et reviendra vers vous prochainement.\n\nCordialement,\n\nL'équipe Recrutement GROUPE ARASH`;
    this.emailService.sendEmail(dto.email, userSubject, userText).catch(err => {
      this.logger.error('Erreur envoi email candidature candidat', err);
    });

    return { success: true, id: application.id };
  }

  async findApplications(page: number = 1, limit: number = 10, jobOfferId?: string, status?: JobApplicationStatus) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (jobOfferId) where.jobOfferId = jobOfferId;
    if (status) where.status = status;

    const [total, applications] = await Promise.all([
      this.prisma.jobApplication.count({ where }),
      this.prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { jobOffer: { select: { title: true } } },
      }),
    ]);

    return {
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateApplicationStatus(id: string, status: JobApplicationStatus) {
    return this.prisma.jobApplication.update({
      where: { id },
      data: { status },
    });
  }
}
