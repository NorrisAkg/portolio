import type { Article as PrismaArticle } from '@prisma/client';
import type { ArticleStatus } from '../domain/article.entity';
import { Article } from '../domain/article.entity';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ArticleMapper {
  static toDomain(prismaArticle: PrismaArticle): Article {
    return Article.create({
      id: prismaArticle.id,
      title: prismaArticle.title,
      slug: prismaArticle.slug,
      description: prismaArticle.description,
      content: prismaArticle.content,
      image: prismaArticle.image,
      status: prismaArticle.status as ArticleStatus,
      publishedAt: prismaArticle.publishedAt,
      createdAt: prismaArticle.createdAt,
      updatedAt: prismaArticle.updatedAt,
    });
  }

  static toPrisma(article: Article): PrismaArticle {
    const props = article.toJSON();
    return {
      id: props.id,
      title: props.title,
      slug: props.slug,
      description: props.description,
      content: props.content,
      image: props.image,
      status: props.status,
      publishedAt: props.publishedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
