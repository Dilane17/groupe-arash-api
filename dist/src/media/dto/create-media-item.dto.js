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
exports.CreateMediaItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateMediaItemDto {
    title;
    type;
    category;
    url;
}
exports.CreateMediaItemDto = CreateMediaItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Titre du média', example: 'Photo de l\'installation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le titre est requis' }),
    __metadata("design:type", String)
], CreateMediaItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type de média', enum: client_1.MediaType, example: 'IMAGE' }),
    (0, class_validator_1.IsEnum)(client_1.MediaType, { message: 'Type de média invalide' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMediaItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Catégorie (ex: installations, produits, evenements)', example: 'installations' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La catégorie est requise' }),
    __metadata("design:type", String)
], CreateMediaItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL du média uploadé', example: 'https://xxx.public.blob.vercel-storage.com/image.jpg' }),
    (0, class_validator_1.IsUrl)({}, { message: 'L\'URL du média doit être valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'URL est requise' }),
    __metadata("design:type", String)
], CreateMediaItemDto.prototype, "url", void 0);
//# sourceMappingURL=create-media-item.dto.js.map