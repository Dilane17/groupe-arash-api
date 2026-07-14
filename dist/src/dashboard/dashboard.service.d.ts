import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        metrics: {
            totalContacts: number;
            unreadContacts: number;
            totalApplications: number;
            newApplications: number;
            totalSubscribers: number;
        };
        activityFeed: {
            id: string;
            type: string;
            name: string;
            description: string;
            date: Date;
            isNew: boolean;
        }[];
        chartData: {
            date: string;
            contacts: number;
            applications: number;
        }[];
    }>;
}
