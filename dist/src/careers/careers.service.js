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
var CareersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const config_1 = require("@nestjs/config");
const slugify_1 = __importDefault(require("slugify"));
let CareersService = CareersService_1 = class CareersService {
    prisma;
    emailService;
    configService;
    logger = new common_1.Logger(CareersService_1.name);
    constructor(prisma, emailService, configService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.configService = configService;
    }
    async generateUniqueSlug(title) {
        const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.prisma.jobOffer.findUnique({ where: { slug } });
            if (!existing)
                break;
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
        return slug;
    }
    async createJobOffer(dto) {
        const slug = await this.generateUniqueSlug(dto.title);
        return this.prisma.jobOffer.create({
            data: { ...dto, slug },
        });
    }
    async updateJobOffer(id, dto) {
        const offer = await this.prisma.jobOffer.findUnique({ where: { id } });
        if (!offer)
            throw new common_1.NotFoundException('Offre introuvable');
        let slug = offer.slug;
        if (dto.title && dto.title !== offer.title) {
            slug = await this.generateUniqueSlug(dto.title);
        }
        return this.prisma.jobOffer.update({
            where: { id },
            data: { ...dto, slug },
        });
    }
    async deleteJobOffer(id) {
        const offer = await this.prisma.jobOffer.findUnique({ where: { id } });
        if (!offer)
            throw new common_1.NotFoundException('Offre introuvable');
        return this.prisma.jobOffer.delete({ where: { id } });
    }
    async findActiveJobOffers() {
        return this.prisma.jobOffer.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllJobOffersAdmin() {
        return this.prisma.jobOffer.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { applications: true } },
            },
        });
    }
    async findJobOfferBySlug(slug) {
        const offer = await this.prisma.jobOffer.findUnique({ where: { slug } });
        if (!offer || !offer.isActive) {
            throw new common_1.NotFoundException('Offre introuvable ou inactive');
        }
        return offer;
    }
    async createApplication(dto) {
        let jobTitle = 'Candidature Spontanée';
        if (dto.jobOfferId) {
            const offer = await this.prisma.jobOffer.findUnique({ where: { id: dto.jobOfferId } });
            if (!offer) {
                throw new common_1.NotFoundException('L\'offre spécifiée est introuvable');
            }
            jobTitle = `Candidature pour: ${offer.title}`;
        }
        const application = await this.prisma.jobApplication.create({
            data: {
                jobOfferId: dto.jobOfferId || null,
                fullName: dto.fullName,
                email: dto.email,
                phone: dto.phone,
                message: dto.message || '',
                cvUrl: dto.cvUrl,
                status: 'RECEIVED',
            },
        });
        const receiverEmail = this.configService.get('CONTACT_RECEIVER_EMAIL');
        if (receiverEmail) {
            const adminSubject = `Nouvelle ${jobTitle}`;
            const adminText = `Nouveau candidat:\n\nNom: ${dto.fullName}\nEmail: ${dto.email}\nTéléphone: ${dto.phone}\nOffre ID: ${dto.jobOfferId || 'N/A'}\n\nMessage:\n${dto.message || 'Aucun message'}\n\nLien CV: ${dto.cvUrl}`;
            this.emailService.sendEmail(receiverEmail, adminSubject, adminText).catch(err => {
                this.logger.error('Erreur envoi email candidature admin', err);
            });
        }
        const userSubject = `Accusé de réception - ${jobTitle}`;
        const userText = `Bonjour ${dto.fullName},\n\nNous avons bien reçu votre candidature.\nNotre équipe de recrutement étudiera votre profil avec attention et reviendra vers vous prochainement.\n\nCordialement,\n\nL'équipe Recrutement GROUPE ARASH`;
        this.emailService.sendEmail(dto.email, userSubject, userText).catch(err => {
            this.logger.error('Erreur envoi email candidature candidat', err);
        });
        return { success: true, id: application.id };
    }
    async findApplications(page = 1, limit = 10, jobOfferId, status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (jobOfferId)
            where.jobOfferId = jobOfferId;
        if (status)
            where.status = status;
        const [total, applications] = await Promise.all([
            this.prisma.jobApplication.count({ where }),
            this.prisma.jobApplication.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { jobOffer: { select: { title: true } } },
            }),
        ]);
        return {
            data: applications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateApplicationStatus(id, status) {
        return this.prisma.jobApplication.update({
            where: { id },
            data: { status },
        });
    }
};
exports.CareersService = CareersService;
exports.CareersService = CareersService = CareersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        config_1.ConfigService])
], CareersService);
//# sourceMappingURL=careers.service.js.map