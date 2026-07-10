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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let NewsService = class NewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateUniqueSlug(title) {
        const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.prisma.newsArticle.findUnique({ where: { slug } });
            if (!existing)
                break;
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
        return slug;
    }
    async createArticle(dto, authorId) {
        const slug = await this.generateUniqueSlug(dto.title);
        return this.prisma.newsArticle.create({
            data: {
                ...dto,
                slug,
                authorId,
                isPublished: false,
            },
        });
    }
    async updateArticle(id, dto) {
        const article = await this.prisma.newsArticle.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException('Article introuvable');
        let slug = article.slug;
        if (dto.title && dto.title !== article.title) {
            slug = await this.generateUniqueSlug(dto.title);
        }
        return this.prisma.newsArticle.update({
            where: { id },
            data: { ...dto, slug },
        });
    }
    async publishArticle(id) {
        const article = await this.prisma.newsArticle.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException('Article introuvable');
        return this.prisma.newsArticle.update({
            where: { id },
            data: {
                isPublished: true,
                publishedAt: article.publishedAt || new Date(),
            },
        });
    }
    async deleteArticle(id) {
        const article = await this.prisma.newsArticle.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException('Article introuvable');
        return this.prisma.newsArticle.delete({ where: { id } });
    }
    async findPublishedArticles(page = 1, limit = 10, category) {
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        if (category) {
            where.category = category;
        }
        const [total, articles] = await Promise.all([
            this.prisma.newsArticle.count({ where }),
            this.prisma.newsArticle.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishedAt: 'desc' },
                include: { author: { select: { name: true } } },
            }),
        ]);
        return {
            data: articles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findArticleBySlug(slug) {
        const article = await this.prisma.newsArticle.findUnique({
            where: { slug },
            include: { author: { select: { name: true } } },
        });
        if (!article || !article.isPublished) {
            throw new common_1.NotFoundException('Article introuvable ou non publié');
        }
        return article;
    }
    async findAllArticlesAdmin() {
        return this.prisma.newsArticle.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } },
        });
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsService);
//# sourceMappingURL=news.service.js.map