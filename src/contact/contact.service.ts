import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactMessageStatus } from '@prisma/client';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const { fullName, email, subject, message } = createContactDto;

    // 1. Enregistrer en base
    const contactMessage = await this.prisma.contactMessage.create({
      data: {
        fullName,
        email,
        subject,
        message,
        status: 'NEW',
      },
    });

    // 2. Envoyer email de notification à l'admin (en arrière-plan)
    const receiverEmail = this.configService.get<string>('CONTACT_RECEIVER_EMAIL');
    if (receiverEmail) {
      const adminSubject = `Nouveau message — ${subject}`;
      const adminText = `Nouveau message de contact:\n\nNom: ${fullName}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`;
      this.emailService.sendEmail(receiverEmail, adminSubject, adminText).catch(err => {
        this.logger.error('Erreur lors de l\'envoi de la notification admin', err);
      });
    }

    // 3. Envoyer accusé de réception à l'expéditeur (en arrière-plan)
    const userSubject = `Accusé de réception - ${subject}`;
    const userText = `Bonjour ${fullName},\n\nNous avons bien reçu votre message concernant "${subject}". Notre équipe reviendra vers vous dans les plus brefs délais.\n\nCordialement,\n\nGROUPE ARASH\ncontact@groupearash.com`;
    this.emailService.sendEmail(email, userSubject, userText).catch(err => {
      this.logger.error('Erreur lors de l\'envoi de l\'accusé de réception', err);
    });

    // 4. Retourner success true sans attendre la fin des emails ou échouer si les emails échouent
    return { success: true, id: contactMessage.id };
  }

  async findAll(page: number = 1, limit: number = 10, status?: ContactMessageStatus) {
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};

    const [total, messages] = await Promise.all([
      this.prisma.contactMessage.count({ where }),
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, status: ContactMessageStatus) {
    const message = await this.prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    return message;
  }
}
