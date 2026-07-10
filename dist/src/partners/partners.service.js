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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PartnersService = class PartnersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPartner(dto) {
        return this.prisma.partner.create({
            data: {
                ...dto,
                order: dto.order ?? 0,
            },
        });
    }
    async updatePartner(id, dto) {
        const partner = await this.prisma.partner.findUnique({ where: { id } });
        if (!partner)
            throw new common_1.NotFoundException('Partenaire introuvable');
        return this.prisma.partner.update({
            where: { id },
            data: dto,
        });
    }
    async deletePartner(id) {
        const partner = await this.prisma.partner.findUnique({ where: { id } });
        if (!partner)
            throw new common_1.NotFoundException('Partenaire introuvable');
        return this.prisma.partner.delete({ where: { id } });
    }
    async findActivePartners(category) {
        const where = { isActive: true };
        if (category) {
            where.category = category;
        }
        return this.prisma.partner.findMany({
            where,
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async findAllPartnersAdmin() {
        return this.prisma.partner.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PartnersService);
//# sourceMappingURL=partners.service.js.map