import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { JobApplicationStatus } from '@prisma/client';
export declare class CareersService {
    private prisma;
    private emailService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, configService: ConfigService);
    private generateUniqueSlug;
    createJobOffer(dto: CreateJobOfferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    }>;
    updateJobOffer(id: string, dto: UpdateJobOfferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    }>;
    deleteJobOffer(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    }>;
    findActiveJobOffers(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    }[]>;
    findAllJobOffersAdmin(): Promise<({
        _count: {
            applications: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    })[]>;
    findJobOfferBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    }>;
    createApplication(dto: CreateJobApplicationDto): Promise<{
        success: boolean;
        id: string;
    }>;
    findApplications(page?: number, limit?: number, jobOfferId?: string, status?: JobApplicationStatus): Promise<{
        data: ({
            jobOffer: {
                title: string;
            } | null;
        } & {
            email: string;
            id: string;
            createdAt: Date;
            fullName: string;
            message: string;
            status: import("@prisma/client").$Enums.JobApplicationStatus;
            phone: string;
            cvUrl: string;
            jobOfferId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateApplicationStatus(id: string, status: JobApplicationStatus): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        fullName: string;
        message: string;
        status: import("@prisma/client").$Enums.JobApplicationStatus;
        phone: string;
        cvUrl: string;
        jobOfferId: string | null;
    }>;
}
