import { ArticleRepository } from '../domain/article.repository';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface DeleteArticleInput {
  id: string;
}

export class DeleteArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: DeleteArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(input.id);
    
    if (!article) {
      throw new ArticleNotFoundError(input.id);
    }

    await this.articleRepository.delete(input.id);
  }
}
