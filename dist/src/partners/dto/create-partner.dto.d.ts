import { PartnerCategory } from '@prisma/client';
export declare class CreatePartnerDto {
    name: string;
    logoUrl: string;
    websiteUrl?: string;
    category: PartnerCategory;
    order?: number;
}
