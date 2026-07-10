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
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NewsletterService = class NewsletterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async subscribe(dto) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            if (existing.isActive) {
                return { success: true };
            }
            else {
                await this.prisma.newsletterSubscriber.update({
                    where: { id: existing.id },
                    data: {
                        isActive: true,
                        unsubscribedAt: null,
                        subscribedAt: new Date(),
                    },
                });
                return { success: true };
            }
        }
        await this.prisma.newsletterSubscriber.create({
            data: {
                email: dto.email,
            },
        });
        return { success: true };
    }
    async unsubscribe(dto) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { email: dto.email },
        });
        if (existing && existing.isActive) {
            await this.prisma.newsletterSubscriber.update({
                where: { id: existing.id },
                data: {
                    isActive: false,
                    unsubscribedAt: new Date(),
                },
            });
        }
        return { success: true };
    }
    async getSubscribers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.newsletterSubscriber.findMany({
                where: { isActive: true },
                orderBy: { subscribedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.newsletterSubscriber.count({
                where: { isActive: true },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async exportSubscribers() {
        const subscribers = await this.prisma.newsletterSubscriber.findMany({
            where: { isActive: true },
            orderBy: { subscribedAt: 'desc' },
            select: { email: true, subscribedAt: true },
        });
        const header = 'email,subscribedAt\n';
        const rows = subscribers
            .map((s) => `${s.email},${s.subscribedAt.toISOString()}`)
            .join('\n');
        return header + rows;
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map