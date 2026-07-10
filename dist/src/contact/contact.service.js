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
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const config_1 = require("@nestjs/config");
let ContactService = ContactService_1 = class ContactService {
    prisma;
    emailService;
    configService;
    logger = new common_1.Logger(ContactService_1.name);
    constructor(prisma, emailService, configService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.configService = configService;
    }
    async create(createContactDto) {
        const { fullName, email, subject, message } = createContactDto;
        const contactMessage = await this.prisma.contactMessage.create({
            data: {
                fullName,
                email,
                subject,
                message,
                status: 'NEW',
            },
        });
        const receiverEmail = this.configService.get('CONTACT_RECEIVER_EMAIL');
        if (receiverEmail) {
            const adminSubject = `Nouveau message — ${subject}`;
            const adminText = `Nouveau message de contact:\n\nNom: ${fullName}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`;
            this.emailService.sendEmail(receiverEmail, adminSubject, adminText).catch(err => {
                this.logger.error('Erreur lors de l\'envoi de la notification admin', err);
            });
        }
        const userSubject = `Accusé de réception - ${subject}`;
        const userText = `Bonjour ${fullName},\n\nNous avons bien reçu votre message concernant "${subject}". Notre équipe reviendra vers vous dans les plus brefs délais.\n\nCordialement,\n\nGROUPE ARASH\ncontact@groupearash.com`;
        this.emailService.sendEmail(email, userSubject, userText).catch(err => {
            this.logger.error('Erreur lors de l\'envoi de l\'accusé de réception', err);
        });
        return { success: true, id: contactMessage.id };
    }
    async findAll(page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [total, messages] = await Promise.all([
            this.prisma.contactMessage.count({ where }),
            this.prisma.contactMessage.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            data: messages,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateStatus(id, status) {
        const message = await this.prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
        return message;
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        config_1.ConfigService])
], ContactService);
//# sourceMappingURL=contact.service.js.map