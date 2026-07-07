import type { Article as PrismaArticle, ArticleTranslation as PrismaArticleTranslation } from '@prisma/client';
import type { ArticleStatus } from '../domain/article.entity';
import { Article } from '../domain/article.entity';

type PrismaArticleWithTranslations = PrismaArticle & {
  translations: PrismaArticleTranslation[];
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ArticleMapper {
  static toDomain(prismaArticle: PrismaArticleWithTranslations): Article {
    return Article.create({
      id: prismaArticle.id,
      image: prismaArticle.image,
      status: prismaArticle.status as ArticleStatus,
      publishedAt: prismaArticle.publishedAt,
      createdAt: prismaArticle.createdAt,
      updatedAt: prismaArticle.updatedAt,
      translations: prismaArticle.translations.map(t => ({
        locale: t.locale,
        title: t.title,
        slug: t.slug,
        description: t.description,
        content: t.content,
      })),
    });
  }

  static toPrisma(article: Article): PrismaArticle {
    const props = article.toJSON();
    return {
      id: props.id,
      image: props.image,
      status: props.status,
      publishedAt: props.publishedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
