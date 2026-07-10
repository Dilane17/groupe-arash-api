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
exports.CreateJobOfferDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateJobOfferDto {
    title;
    department;
    location;
    type;
    description;
    requirements;
}
exports.CreateJobOfferDto = CreateJobOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Titre du poste', example: 'Développeur Fullstack React/Node' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le titre est requis' }),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateJobOfferDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Département', example: 'IT & Engineering' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le département est requis' }),
    __metadata("design:type", String)
], CreateJobOfferDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lieu du poste', example: 'Paris, France' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La localisation est requise' }),
    __metadata("design:type", String)
], CreateJobOfferDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type de contrat', enum: client_1.JobType, example: 'CDI' }),
    (0, class_validator_1.IsEnum)(client_1.JobType, { message: 'Type de contrat invalide' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobOfferDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description du poste', example: 'Nous recherchons...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La description est requise' }),
    __metadata("design:type", String)
], CreateJobOfferDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pré-requis', example: '- 3 ans d\'expérience...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Les pré-requis sont requis' }),
    __metadata("design:type", String)
], CreateJobOfferDto.prototype, "requirements", void 0);
//# sourceMappingURL=create-job-offer.dto.js.map