import { CareersService } from './careers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JobApplicationStatus } from '@prisma/client';
export declare class CareersController {
    private readonly careersService;
    constructor(careersService: CareersService);
    findActiveJobOffers(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
        slug: string;
    }[]>;
    findJobOfferBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
        slug: string;
    }>;
    createJobOffer(createJobOfferDto: CreateJobOfferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
        slug: string;
    }>;
    updateJobOffer(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
        slug: string;
    }>;
    deleteJobOffer(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import("@prisma/client").$Enums.JobType;
        title: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
        slug: string;
    }>;
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
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
        slug: string;
    })[]>;
    generateUploadUrl(filename: string): Promise<{
        type: string;
        clientPayload: string;
    }>;
    createApplication(createJobApplicationDto: CreateJobApplicationDto): Promise<{
        success: boolean;
        id: string;
    }>;
    findApplications(page?: string, limit?: string, jobOfferId?: string, status?: JobApplicationStatus): Promise<{
        data: ({
            jobOffer: {
                title: string;
            } | null;
        } & {
            id: string;
            email: string;
            createdAt: Date;
            message: string;
            fullName: string;
            status: import("@prisma/client").$Enums.JobApplicationStatus;
            jobOfferId: string | null;
            phone: string;
            cvUrl: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateApplicationStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        message: string;
        fullName: string;
        status: import("@prisma/client").$Enums.JobApplicationStatus;
        jobOfferId: string | null;
        phone: string;
        cvUrl: string;
    }>;
}
