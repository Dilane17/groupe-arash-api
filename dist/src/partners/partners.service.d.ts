import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerCategory } from '@prisma/client';
export declare class PartnersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPartner(dto: CreatePartnerDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        category: import("@prisma/client").$Enums.PartnerCategory;
        logoUrl: string;
        websiteUrl: string | null;
        order: number;
    }>;
    updatePartner(id: string, dto: UpdatePartnerDto): Promise<{
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
