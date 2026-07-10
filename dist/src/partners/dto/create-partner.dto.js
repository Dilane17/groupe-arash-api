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
exports.CreatePartnerDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreatePartnerDto {
    name;
    logoUrl;
    websiteUrl;
    category;
    order;
}
exports.CreatePartnerDto = CreatePartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du partenaire', example: 'Microsoft' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom est requis' }),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL du logo uploadé', example: 'https://xxx.public.blob.vercel-storage.com/logo.png' }),
    (0, class_validator_1.IsUrl)({}, { message: 'L\'URL du logo doit être valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le logo est requis' }),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Site web du partenaire', example: 'https://microsoft.com' }),
    (0, class_validator_1.IsUrl)({}, { message: 'L\'URL du site web doit être valide' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "websiteUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Catégorie du partenaire', enum: client_1.PartnerCategory, example: 'TECHNIQUE' }),
    (0, class_validator_1.IsEnum)(client_1.PartnerCategory, { message: 'Catégorie invalide' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ordre d\'affichage (tri ascendant)', example: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePartnerDto.prototype, "order", void 0);
//# sourceMappingURL=create-partner.dto.js.map