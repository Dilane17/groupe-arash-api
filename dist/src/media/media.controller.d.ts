import { MediaService } from './media.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { MediaType } from '@prisma/client';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findMedia(page?: string, limit?: string, type?: MediaType, category?: string): Promise<{
        data: {
            url: string;
            id: string;
            createdAt: Date;
            title: string;
            type: import("@prisma/client").$Enums.MediaType;
            category: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    generateUploadUrl(filename: string, type: MediaType, category: string): Promise<{
        type: string;
        clientPayload: string;
    }>;
    createMediaItem(createMediaItemDto: CreateMediaItemDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.MediaType;
        category: string;
    }>;
    deleteMediaItem(id: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        title: string;
        type: import("@prisma/client").$Enums.MediaType;
        category: string;
    }>;
}
