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
        slug: string;
        department: string;
        location: string;
        requirements: string;
        isActive: boolean;
    }[]>;
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
    createJobOffer(createJobOfferDto: CreateJobOfferDto): Promise<{
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
    updateJobOffer(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<{
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
    updateApplicationStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<{
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
