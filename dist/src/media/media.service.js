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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const blob_1 = require("@vercel/blob");
let MediaService = class MediaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMediaItem(dto) {
        return this.prisma.mediaItem.create({
            data: dto,
        });
    }
    async deleteMediaItem(id) {
        const media = await this.prisma.mediaItem.findUnique({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('Média introuvable');
        if (media.url && media.url.includes('vercel-storage.com')) {
            try {
                await (0, blob_1.del)(media.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
            }
            catch (error) {
                console.error('Erreur lors de la suppression du Vercel Blob:', error);
            }
        }
        return this.prisma.mediaItem.delete({ where: { id } });
    }
    async findMedia(page = 1, limit = 20, type, category) {
        const skip = (page - 1) * limit;
        const where = {};
        if (type)
            where.type = type;
        if (category)
            where.category = category;
        const [total, media] = await Promise.all([
            this.prisma.mediaItem.count({ where }),
            this.prisma.mediaItem.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            data: media,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map