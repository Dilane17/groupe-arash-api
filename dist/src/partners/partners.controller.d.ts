import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerCategory } from '@prisma/client';
export declare class PartnersController {
    private readonly partnersService;
    constructor(partnersService: PartnersService);
    findActivePartners(category?: PartnerCategory): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        category: import("@prisma/client").$Enums.PartnerCategory;
        logoUrl: string;
        websiteUrl: string | null;
        order: number;
    }[]>;
    generateUploadUrl(filename: string): Promise<{
        type: string;
        clientPayload: string;
    }>;
    createPartner(createPartnerDto: CreatePartnerDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        category: import("@prisma/client").$Enums.PartnerCategory;
        logoUrl: string;
        websiteUrl: string | null;
        order: number;
    }>;
    updatePartner(id: string, updatePartnerDto: UpdatePartnerDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        category: import("@prisma/client").$Enums.PartnerCategory;
        logoUrl: string;
        websiteUrl: string | null;
        order: number;
    }>;
    deletePartner(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        category: import("@prisma/client").$Enums.PartnerCategory;
        logoUrl: string;
        websiteUrl: string | null;
        order: number;
    }>;
    findAllPartnersAdmin(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        category: import("@prisma/client").$Enums.PartnerCategory;
        logoUrl: string;
        websiteUrl: string | null;
        order: number;
    }[]>;
}
