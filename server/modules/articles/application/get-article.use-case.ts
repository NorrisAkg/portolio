import type { ArticleRepository } from '../domain/article.repository';
import type { Article } from '../domain/article.entity';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface GetArticleInput {
  slug?: string;
  id?: string;
}

export class GetArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: GetArticleInput): Promise<Article> {
    let article: Article | null = null;

    if (input.id) {
      article = await this.articleRepository.findById(input.id);
    }

    if (!article && input.slug) {
      article = await this.articleRepository.findBySlug(input.slug);
      if (!article) {
        article = await this.articleRepository.findById(input.slug);
      }
    }

    if (!article) {
      throw new ArticleNotFoundError(input.id || input.slug || 'inconnu');
    }

    return article;
  }
}
