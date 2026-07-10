import { ArticleCategory } from '@prisma/client';
export declare class CreateNewsArticleDto {
    title: string;
    excerpt: string;
    content: string;
    coverImageUrl?: string;
    category: ArticleCategory;
}
