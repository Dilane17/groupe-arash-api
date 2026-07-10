import { NewsService } from './news.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { ArticleCategory } from '@prisma/client';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    findPublishedArticles(page?: string, limit?: string, category?: ArticleCategory): Promise<{
        data: ({
            author: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            excerpt: string;
            content: string;
            coverImageUrl: string | null;
            category: import("@prisma/client").$Enums.ArticleCategory;
            isPublished: boolean;
            publishedAt: Date | null;
            authorId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findArticleBySlug(slug: string): Promise<{
        author: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImageUrl: string | null;
        category: import("@prisma/client").$Enums.ArticleCategory;
        isPublished: boolean;
        publishedAt: Date | null;
        authorId: string;
    }>;
    generateUploadUrl(filename: string): Promise<{
        type: string;
        clientPayload: string;
    }>;
    createArticle(createNewsArticleDto: CreateNewsArticleDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImageUrl: string | null;
        category: import("@prisma/client").$Enums.ArticleCategory;
        isPublished: boolean;
        publishedAt: Date | null;
        authorId: string;
    }>;
    updateArticle(id: string, updateNewsArticleDto: UpdateNewsArticleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImageUrl: string | null;
        category: import("@prisma/client").$Enums.ArticleCategory;
        isPublished: boolean;
        publishedAt: Date | null;
        authorId: string;
    }>;
    publishArticle(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImageUrl: string | null;
        category: import("@prisma/client").$Enums.ArticleCategory;
        isPublished: boolean;
        publishedAt: Date | null;
        authorId: string;
    }>;
    deleteArticle(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImageUrl: string | null;
        category: import("@prisma/client").$Enums.ArticleCategory;
        isPublished: boolean;
        publishedAt: Date | null;
        authorId: string;
    }>;
    findAllArticlesAdmin(): Promise<({
        author: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        coverImageUrl: string | null;
        category: import("@prisma/client").$Enums.ArticleCategory;
        isPublished: boolean;
        publishedAt: Date | null;
        authorId: string;
    })[]>;
}
