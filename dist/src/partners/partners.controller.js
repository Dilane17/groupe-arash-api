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
exports.PartnersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const partners_service_1 = require("./partners.service");
const create_partner_dto_1 = require("./dto/create-partner.dto");
const update_partner_dto_1 = require("./dto/update-partner.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const client_2 = require("@vercel/blob/client");
let PartnersController = class PartnersController {
    partnersService;
    constructor(partnersService) {
        this.partnersService = partnersService;
    }
    findActivePartners(category) {
        return this.partnersService.findActivePartners(category);
    }
    async generateUploadUrl(filename) {
        if (!filename) {
            throw new Error('Le nom du fichier est requis');
        }
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const pathname = `partners/${Date.now()}-${safeFilename}`;
        const clientToken = await (0, client_2.generateClientTokenFromReadWriteToken)({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            allowedContentTypes: [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/svg+xml',
            ],
            maximumSizeInBytes: 2 * 1024 * 1024,
            pathname,
            validUntil: Date.now() + 1000 * 60 * 5,
        });
        return { type: 'blob', clientPayload: clientToken };
    }
    createPartner(createPartnerDto) {
        return this.partnersService.createPartner(createPartnerDto);
    }
    updatePartner(id, updatePartnerDto) {
        return this.partnersService.updatePartner(id, updatePartnerDto);
    }
    deletePartner(id) {
        return this.partnersService.deletePartner(id);
    }
    findAllPartnersAdmin() {
        return this.partnersService.findAllPartnersAdmin();
    }
};
exports.PartnersController = PartnersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les partenaires actifs (Public)' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: client_1.PartnerCategory }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des partenaires actifs.' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findActivePartners", null);
__decorate([
    (0, common_1.Post)('upload-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un token d\'upload pour le logo (Admin/Editor)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token généré.' }),
    __param(0, (0, common_1.Body)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "generateUploadUrl", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un partenaire (Admin/Editor)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_partner_dto_1.CreatePartnerDto]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "createPartner", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un partenaire (Admin/Editor)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_partner_dto_1.UpdatePartnerDto]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "updatePartner", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un partenaire (Admin seulement)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "deletePartner", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les partenaires (Admin/Editor)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findAllPartnersAdmin", null);
exports.PartnersController = PartnersController = __decorate([
    (0, swagger_1.ApiTags)('Partners'),
    (0, common_1.Controller)('partners'),
    __metadata("design:paramtypes", [partners_service_1.PartnersService])
], PartnersController);
//# sourceMappingURL=partners.controller.js.map