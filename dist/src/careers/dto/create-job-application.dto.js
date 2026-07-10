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
exports.CreateJobApplicationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateJobApplicationDto {
    jobOfferId;
    fullName;
    email;
    phone;
    message;
    cvUrl;
}
exports.CreateJobApplicationDto = CreateJobApplicationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de l\'offre (null si candidature spontanée)', example: 'cuid123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJobApplicationDto.prototype, "jobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom complet du candidat', example: 'Marie Dupont' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom est requis' }),
    __metadata("design:type", String)
], CreateJobApplicationDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email du candidat', example: 'marie.dupont@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'L\'email doit être valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email est requis' }),
    __metadata("design:type", String)
], CreateJobApplicationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Numéro de téléphone', example: '+33 6 12 34 56 78' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le téléphone est requis' }),
    __metadata("design:type", String)
], CreateJobApplicationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message ou lettre de motivation', example: 'Je suis très intéressée...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJobApplicationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL du CV uploadé sur Vercel Blob', example: 'https://xxx.public.blob.vercel-storage.com/cv.pdf' }),
    (0, class_validator_1.IsUrl)({}, { message: 'L\'URL du CV doit être valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le CV est requis' }),
    __metadata("design:type", String)
], CreateJobApplicationDto.prototype, "cvUrl", void 0);
//# sourceMappingURL=create-job-application.dto.js.map