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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const news_service_1 = require("./news.service");
const create_news_article_dto_1 = require("./dto/create-news-article.dto");
const update_news_article_dto_1 = require("./dto/update-news-article.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const client_2 = require("@vercel/blob/client");
let NewsController = class NewsController {
    newsService;
    constructor(newsService) {
        this.newsService = newsService;
    }
    findPublishedArticles(page, limit, category) {
        return this.newsService.findPublishedArticles(page ? +page : 1, limit ? +limit : 10, category);
    }
    findArticleBySlug(slug) {
        return this.newsService.findArticleBySlug(slug);
    }
    async generateUploadUrl(filename) {
        if (!filename) {
            throw new Error('Le nom du fichier est requis');
        }
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const pathname = `news/${Date.now()}-${safeFilename}`;
        const clientToken = await (0, client_2.generateClientTokenFromReadWriteToken)({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            allowedContentTypes: [
                'image/jpeg',
                'image/png',
                'image/webp',
            ],
            maximumSizeInBytes: 5 * 1024 * 1024,
            pathname,
            validUntil: Date.now() + 1000 * 60 * 5,
        });
        return { type: 'blob', clientPayload: clientToken };
    }
    createArticle(createNewsArticleDto, user) {
        return this.newsService.createArticle(createNewsArticleDto, user.id);
    }
    updateArticle(id, updateNewsArticleDto) {
        return this.newsService.updateArticle(id, updateNewsArticleDto);
    }
    publishArticle(id) {
        return this.newsService.publishArticle(id);
    }
    deleteArticle(id) {
        return this.newsService.deleteArticle(id);
    }
    findAllArticlesAdmin() {
        return this.newsService.findAllArticlesAdmin();
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les articles publiés (Public)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: client_1.ArticleCategory }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste paginée des articles.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "findPublishedArticles", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d\'un article publié via slug (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détail de l\'article.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "findArticleBySlug", null);
__decorate([
    (0, common_1.Post)('upload-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un token d\'upload pour l\'image de couverture (Admin/Editor)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token généré.' }),
    __param(0, (0, common_1.Body)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "generateUploadUrl", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un article (Admin/Editor)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_news_article_dto_1.CreateNewsArticleDto, Object]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un article (Admin/Editor)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_news_article_dto_1.UpdateNewsArticleDto]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "updateArticle", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Publier un article (Admin/Editor)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "publishArticle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un article (Admin seulement)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "deleteArticle", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les articles (Admin/Editor)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "findAllArticlesAdmin", null);
exports.NewsController = NewsController = __decorate([
    (0, swagger_1.ApiTags)('News'),
    (0, common_1.Controller)('news'),
    __metadata("design:paramtypes", [news_service_1.NewsService])
], NewsController);
//# sourceMappingURL=news.controller.js.map