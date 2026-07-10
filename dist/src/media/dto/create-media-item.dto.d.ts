import { MediaType } from '@prisma/client';
export declare class CreateMediaItemDto {
    title: string;
    type: MediaType;
    category: string;
    url: string;
}
