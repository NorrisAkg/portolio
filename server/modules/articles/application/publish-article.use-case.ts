import { ArticleRepository } from '../domain/article.repository';
import { Article } from '../domain/article.entity';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface PublishArticleInput {
  id: string;
}

export class PublishArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: PublishArticleInput): Promise<Article> {
    const article = await this.articleRepository.findById(input.id);
    
    if (!article) {
      throw new ArticleNotFoundError(input.id);
    }

    article.publish();
    await this.articleRepository.save(article);
    
    return article;
  }
}
