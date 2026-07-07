import { ArticleRepository } from '../domain/article.repository';
import { Article } from '../domain/article.entity';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface GetArticleInput {
  slug: string;
}

export class GetArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: GetArticleInput): Promise<Article> {
    const article = await this.articleRepository.findBySlug(input.slug);
    
    if (!article) {
      throw new ArticleNotFoundError(input.slug);
    }

    return article;
  }
}
