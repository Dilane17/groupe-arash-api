import { NewsletterService } from './newsletter.service';
import { NewsletterEmailDto } from './dto/newsletter.dto';
import type { Response } from 'express';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(dto: NewsletterEmailDto): Promise<{
        success: boolean;
    }>;
    unsubscribe(dto: NewsletterEmailDto): Promise<{
        success: boolean;
    }>;
    getSubscribers(page: number, limit: number): Promise<{
        data: {
            id: string;
            email: string;
            isActive: boolean;
            subscribedAt: Date;
            unsubscribedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    exportSubscribers(res: Response): Promise<Response<any, Record<string, any>>>;
}
