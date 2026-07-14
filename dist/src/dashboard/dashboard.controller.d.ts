import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
