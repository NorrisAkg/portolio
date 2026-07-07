import type { PrismaClient } from '@prisma/client';
import type { ArticleRepository, FindAllParams, PaginatedResult } from '../domain/article.repository';
import type { Article } from '../domain/article.entity';
import { ArticleMapper } from './article.mapper';

export class PrismaArticleRepository implements ArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Article | null> {
    const prismaArticle = await this.prisma.article.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!prismaArticle) return null;
    return ArticleMapper.toDomain(prismaArticle as any);
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const prismaArticle = await this.prisma.article.findFirst({
      where: {
        translations: {
          some: { slug },
        },
      },
      include: { translations: true },
    });

    if (!prismaArticle) return null;
    return ArticleMapper.toDomain(prismaArticle as any);
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
        include: { translations: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: prismaArticles.map(a => ArticleMapper.toDomain(a as any)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async save(article: Article): Promise<void> {
    const props = article.toJSON();

    await this.prisma.article.upsert({
      where: { id: props.id },
      update: {
        image: props.image,
        status: props.status,
        publishedAt: props.publishedAt,
        updatedAt: new Date(),
        translations: {
          upsert: props.translations.map(t => ({
            where: {
              articleId_locale: {
                articleId: props.id,
                locale: t.locale,
              },
            },
            update: {
              title: t.title,
              slug: t.slug,
              description: t.description,
              content: t.content,
            },
            create: {
              locale: t.locale,
              title: t.title,
              slug: t.slug,
              description: t.description,
              content: t.content,
            },
          })),
        },
      },
      create: {
        id: props.id,
        image: props.image,
        status: props.status,
        publishedAt: props.publishedAt,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
        translations: {
          create: props.translations.map(t => ({
            locale: t.locale,
            title: t.title,
            slug: t.slug,
            description: t.description,
            content: t.content,
          })),
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }
}
