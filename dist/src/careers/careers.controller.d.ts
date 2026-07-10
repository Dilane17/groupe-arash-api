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
        title: string;
        slug: string;
        department: string;
        location: string;
        type: import("@prisma/client").$Enums.JobType;
        description: string;
        requirements: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findJobOfferBySlug(slug: string): Promise<{
        id: string;
        title: string;
        slug: string;
        department: string;
        location: string;
        type: import("@prisma/client").$Enums.JobType;
        description: string;
        requirements: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createJobOffer(createJobOfferDto: CreateJobOfferDto): Promise<{
        id: string;
        title: string;
        slug: string;
        department: string;
        location: string;
        type: import("@prisma/client").$Enums.JobType;
        description: string;
        requirements: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateJobOffer(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<{
        id: string;
        title: string;
        slug: string;
        department: string;
        location: string;
        type: import("@prisma/client").$Enums.JobType;
        description: string;
        requirements: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteJobOffer(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        department: string;
        location: string;
        type: import("@prisma/client").$Enums.JobType;
        description: string;
        requirements: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllJobOffersAdmin(): Promise<({
        _count: {
            applications: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        department: string;
        location: string;
        type: import("@prisma/client").$Enums.JobType;
        description: string;
        requirements: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    uploadCv(file: any): Promise<{
        success: boolean;
        url: string;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        url?: undefined;
    }>;
    createApplication(createJobApplicationDto: CreateJobApplicationDto): Promise<{
        success: boolean;
        id: string;
    } | {
        success: boolean;
        message: any;
    }>;
    findApplications(page?: string, limit?: string, jobOfferId?: string, status?: JobApplicationStatus): Promise<{
        data: ({
            jobOffer: {
                title: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            message: string;
            fullName: string;
            email: string;
            phone: string;
            cvUrl: string;
            status: import("@prisma/client").$Enums.JobApplicationStatus;
            jobOfferId: string | null;
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
        createdAt: Date;
        message: string;
        fullName: string;
        email: string;
        phone: string;
        cvUrl: string;
        status: import("@prisma/client").$Enums.JobApplicationStatus;
        jobOfferId: string | null;
    }>;
}
