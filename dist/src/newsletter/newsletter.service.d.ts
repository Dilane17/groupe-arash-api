import { PrismaService } from '../prisma/prisma.service';
import { NewsletterEmailDto } from './dto/newsletter.dto';
export declare class NewsletterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    subscribe(dto: NewsletterEmailDto): Promise<{
        success: boolean;
    }>;
    unsubscribe(dto: NewsletterEmailDto): Promise<{
        success: boolean;
    }>;
    getSubscribers(page?: number, limit?: number): Promise<{
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
    exportSubscribers(): Promise<string>;
}
