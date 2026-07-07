import { PrismaClient } from '@prisma/client';
import { ArticleRepository, FindAllParams, PaginatedResult } from '../domain/article.repository';
import { Article } from '../domain/article.entity';
import { ArticleMapper } from './article.mapper';

export class PrismaArticleRepository implements ArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Article | null> {
    const prismaArticle = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!prismaArticle) return null;
    return ArticleMapper.toDomain(prismaArticle);
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const prismaArticle = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!prismaArticle) return null;
    return ArticleMapper.toDomain(prismaArticle);
  }

  async findAll(params: FindAllParams): Promise<PaginatedResult<Article>> {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [total, prismaArticles] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: prismaArticles.map(ArticleMapper.toDomain),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async save(article: Article): Promise<void> {
    const prismaArticle = ArticleMapper.toPrisma(article);
    
    await this.prisma.article.upsert({
      where: { id: prismaArticle.id },
      update: prismaArticle,
      create: prismaArticle,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }
}
