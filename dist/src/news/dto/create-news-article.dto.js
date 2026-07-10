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
exports.CreateNewsArticleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateNewsArticleDto {
    title;
    excerpt;
    content;
    coverImageUrl;
    category;
}
exports.CreateNewsArticleDto = CreateNewsArticleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Titre de l\'article', example: 'Nouveau partenariat avec l\'État' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le titre est requis' }),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Extrait (max 300 caractères)', example: 'Nous sommes fiers d\'annoncer...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'extrait est requis' }),
    (0, class_validator_1.MaxLength)(300, { message: 'L\'extrait ne doit pas dépasser 300 caractères' }),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contenu complet (HTML ou Markdown)', example: '<p>Le contenu...</p>' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le contenu est requis' }),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL de l\'image de couverture uploadée', example: 'https://xxx.public.blob.vercel-storage.com/image.jpg' }),
    (0, class_validator_1.IsUrl)({}, { message: 'L\'URL de l\'image doit être valide' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Catégorie de l\'article', enum: client_1.ArticleCategory, example: 'ACTUALITE' }),
    (0, class_validator_1.IsEnum)(client_1.ArticleCategory, { message: 'Catégorie invalide' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNewsArticleDto.prototype, "category", void 0);
//# sourceMappingURL=create-news-article.dto.js.map