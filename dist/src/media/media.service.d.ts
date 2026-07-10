import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { MediaType } from '@prisma/client';
export declare class MediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createMediaItem(dto: CreateMediaItemDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MediaType;
        title: string;
        category: string;
    }>;
    deleteMediaItem(id: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MediaType;
        title: string;
        category: string;
    }>;
    findMedia(page?: number, limit?: number, type?: MediaType, category?: string): Promise<{
        data: {
            url: string;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.MediaType;
            title: string;
            category: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
