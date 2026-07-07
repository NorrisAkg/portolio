import type { ArticleRepository } from '../domain/article.repository';
import type { Article } from '../domain/article.entity';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface UpdateArticleInput {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  image?: string | null;
}

export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: UpdateArticleInput): Promise<Article> {
    const article = await this.articleRepository.findById(input.id);
    
    if (!article) {
      throw new ArticleNotFoundError(input.id);
    }

    const updates: Partial<UpdateArticleInput> = { ...input };
    delete updates.id; // Don't update ID

    article.update(updates);
    await this.articleRepository.save(article);
    
    return article;
  }
}
