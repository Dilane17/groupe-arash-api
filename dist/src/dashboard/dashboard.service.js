"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [totalContacts, unreadContacts, totalApplications, newApplications, totalSubscribers, recentContacts, recentApplications,] = await Promise.all([
            this.prisma.contactMessage.count(),
            this.prisma.contactMessage.count({ where: { status: 'NEW' } }),
            this.prisma.jobApplication.count(),
            this.prisma.jobApplication.count({ where: { status: 'RECEIVED' } }),
            this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
            this.prisma.contactMessage.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fullName: true, subject: true, createdAt: true, status: true },
            }),
            this.prisma.jobApplication.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fullName: true, jobOffer: { select: { title: true } }, createdAt: true, status: true },
            }),
        ]);
        const activityFeed = [
            ...recentContacts.map(c => ({
                id: `contact-${c.id}`,
                type: 'contact',
                name: c.fullName,
                description: c.subject,
                date: c.createdAt,
                isNew: c.status === 'NEW',
            })),
            ...recentApplications.map(a => ({
                id: `app-${a.id}`,
                type: 'application',
                name: a.fullName,
                description: a.jobOffer?.title || 'Candidature spontanée',
                date: a.createdAt,
                isNew: a.status === 'RECEIVED',
            }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
        const contactsLast30Days = await this.prisma.contactMessage.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { createdAt: true },
        });
        const applicationsLast30Days = await this.prisma.jobApplication.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { createdAt: true },
        });
        const chartMap = new Map();
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            chartMap.set(dateString, { date: dateString, contacts: 0, applications: 0 });
        }
        contactsLast30Days.forEach(c => {
            const d = c.createdAt.toISOString().split('T')[0];
            if (chartMap.has(d)) {
                chartMap.get(d).contacts++;
            }
        });
        applicationsLast30Days.forEach(a => {
            const d = a.createdAt.toISOString().split('T')[0];
            if (chartMap.has(d)) {
                chartMap.get(d).applications++;
            }
        });
        return {
            metrics: {
                totalContacts,
                unreadContacts,
                totalApplications,
                newApplications,
                totalSubscribers,
            },
            activityFeed,
            chartData: Array.from(chartMap.values()),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map