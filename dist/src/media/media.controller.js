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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const media_service_1 = require("./media.service");
const create_media_item_dto_1 = require("./dto/create-media-item.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const client_2 = require("@vercel/blob/client");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    findMedia(page, limit, type, category) {
        return this.mediaService.findMedia(page ? +page : 1, limit ? +limit : 20, type, category);
    }
    async generateUploadUrl(filename, type, category) {
        if (!filename || !type || !category) {
            throw new Error('Le nom du fichier, le type et la catégorie sont requis');
        }
        let allowedContentTypes = [];
        let maximumSizeInBytes = 10 * 1024 * 1024;
        switch (type) {
            case 'IMAGE':
                allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp'];
                break;
            case 'VIDEO':
                allowedContentTypes = ['video/mp4', 'video/quicktime'];
                maximumSizeInBytes = 100 * 1024 * 1024;
                break;
            case 'DOCUMENT':
                allowedContentTypes = ['application/pdf'];
                break;
            default:
                throw new Error('Type de média non supporté');
        }
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const safeCategory = category.replace(/[^a-zA-Z0-9-]/g, '_');
        const pathname = `media/${safeCategory}/${Date.now()}-${safeFilename}`;
        const clientToken = await (0, client_2.generateClientTokenFromReadWriteToken)({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            allowedContentTypes,
            maximumSizeInBytes,
            pathname,
            validUntil: Date.now() + 1000 * 60 * 5,
        });
        return { type: 'blob', clientPayload: clientToken };
    }
    createMediaItem(createMediaItemDto) {
        return this.mediaService.createMediaItem(createMediaItemDto);
    }
    deleteMediaItem(id) {
        return this.mediaService.deleteMediaItem(id);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les médias (Public)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: client_1.MediaType }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste paginée des médias.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findMedia", null);
__decorate([
    (0, common_1.Post)('upload-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un token d\'upload pour un média (Admin/Editor)' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: client_1.MediaType, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'category', type: String, required: true }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token généré.' }),
    __param(0, (0, common_1.Body)('filename')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "generateUploadUrl", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une référence de média (Admin/Editor)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_item_dto_1.CreateMediaItemDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "createMediaItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un média (Admin/Editor)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "deleteMediaItem", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map