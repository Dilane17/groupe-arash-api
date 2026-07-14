import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactMessageStatus } from '@prisma/client';
export declare class ContactService {
    private prisma;
    private emailService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, configService: ConfigService);
    create(createContactDto: CreateContactDto): Promise<{
        success: boolean;
        id: string;
    }>;
    findAll(page?: number, limit?: number, status?: ContactMessageStatus): Promise<{
        data: {
            email: string;
            id: string;
            createdAt: Date;
            fullName: string;
            subject: string;
            message: string;
            status: import("@prisma/client").$Enums.ContactMessageStatus;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, status: ContactMessageStatus): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        fullName: string;
        subject: string;
        message: string;
        status: import("@prisma/client").$Enums.ContactMessageStatus;
    }>;
}
