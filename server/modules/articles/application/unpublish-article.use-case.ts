import type { ArticleRepository } from '../domain/article.repository';
import type { Article } from '../domain/article.entity';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface UnpublishArticleInput {
  id: string;
}

export class UnpublishArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: UnpublishArticleInput): Promise<Article> {
    const article = await this.articleRepository.findById(input.id);
    
    if (!article) {
      throw new ArticleNotFoundError(input.id);
    }

    article.unpublish();
    await this.articleRepository.save(article);
    
    return article;
  }
}
