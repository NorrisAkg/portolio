import type { ArticleRepository } from '../domain/article.repository';
import type { ArticleTranslationProps } from '../domain/article.entity';
import { Article } from '../domain/article.entity';
import { randomUUID } from 'crypto';

export interface CreateArticleInput {
  image?: string | null;
  translations: ArticleTranslationProps[];
}

export class CreateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<Article> {
    const now = new Date();

    const article = Article.create({
      id: randomUUID(),
      image: input.image ?? null,
      status: 'DRAFT',
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      translations: input.translations,
    });

    await this.articleRepository.save(article);

    return article;
  }
}
