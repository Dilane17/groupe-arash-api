import { JobType } from '@prisma/client';
export declare class CreateJobOfferDto {
    title: string;
    department: string;
    location: string;
    type: JobType;
    description: string;
    requirements: string;
}
