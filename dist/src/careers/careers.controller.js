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
exports.CareersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const careers_service_1 = require("./careers.service");
const create_job_offer_dto_1 = require("./dto/create-job-offer.dto");
const update_job_offer_dto_1 = require("./dto/update-job-offer.dto");
const create_job_application_dto_1 = require("./dto/create-job-application.dto");
const update_application_status_dto_1 = require("./dto/update-application-status.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const throttler_1 = require("@nestjs/throttler");
const client_1 = require("@prisma/client");
const blob_1 = require("@vercel/blob");
const platform_express_1 = require("@nestjs/platform-express");
let CareersController = class CareersController {
    careersService;
    constructor(careersService) {
        this.careersService = careersService;
    }
    findActiveJobOffers() {
        return this.careersService.findActiveJobOffers();
    }
    findJobOfferBySlug(slug) {
        return this.careersService.findJobOfferBySlug(slug);
    }
    createJobOffer(createJobOfferDto) {
        return this.careersService.createJobOffer(createJobOfferDto);
    }
    updateJobOffer(id, updateJobOfferDto) {
        return this.careersService.updateJobOffer(id, updateJobOfferDto);
    }
    deleteJobOffer(id) {
        return this.careersService.deleteJobOffer(id);
    }
    findAllJobOffersAdmin() {
        return this.careersService.findAllJobOffersAdmin();
    }
    async uploadCv(file) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const pathname = `cv/${Date.now()}-${safeFilename}`;
        try {
            const blob = await (0, blob_1.put)(pathname, file.buffer, {
                access: 'private',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            return { success: true, url: blob.url };
        }
        catch (error) {
            console.error("Vercel Blob Upload Error:", error);
            return { success: false, message: error.message || error.toString() };
        }
    }
    async createApplication(createJobApplicationDto) {
        try {
            return await this.careersService.createApplication(createJobApplicationDto);
        }
        catch (e) {
            console.error("ERROR IN createApplication:", e);
            return { success: false, message: e.message || e.toString() };
        }
    }
    findApplications(page, limit, jobOfferId, status) {
        return this.careersService.findApplications(page ? +page : 1, limit ? +limit : 10, jobOfferId, status);
    }
    updateApplicationStatus(id, updateApplicationStatusDto) {
        return this.careersService.updateApplicationStatus(id, updateApplicationStatusDto.status);
    }
};
exports.CareersController = CareersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les offres actives (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des offres actives.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "findActiveJobOffers", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Détail d\'une offre active via slug (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détail de l\'offre.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Offre introuvable.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "findJobOfferBySlug", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une offre (Admin/Editor)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_offer_dto_1.CreateJobOfferDto]),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "createJobOffer", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une offre (Admin/Editor)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_offer_dto_1.UpdateJobOfferDto]),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "updateJobOffer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une offre (Admin seulement)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "deleteJobOffer", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les offres (Admin/Editor)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "findAllJobOffersAdmin", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 300000 } }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Uploader un CV directement (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'CV uploadé.' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "uploadCv", null);
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 300000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre une candidature (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Candidature enregistrée et emails envoyés.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_application_dto_1.CreateJobApplicationDto]),
    __metadata("design:returntype", Promise)
], CareersController.prototype, "createApplication", null);
__decorate([
    (0, common_1.Get)('applications/list'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les candidatures (Admin/Editor)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'jobOfferId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.JobApplicationStatus }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('jobOfferId')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "findApplications", null);
__decorate([
    (0, common_1.Patch)('applications/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'EDITOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut d\'une candidature (Admin/Editor)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_status_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", void 0)
], CareersController.prototype, "updateApplicationStatus", null);
exports.CareersController = CareersController = __decorate([
    (0, swagger_1.ApiTags)('Careers'),
    (0, common_1.Controller)('careers'),
    __metadata("design:paramtypes", [careers_service_1.CareersService])
], CareersController);
//# sourceMappingURL=careers.controller.js.map