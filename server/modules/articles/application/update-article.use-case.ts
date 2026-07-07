import type { ArticleRepository } from '../domain/article.repository';
import type { Article, ArticleTranslationProps } from '../domain/article.entity';
import { ArticleNotFoundError } from '../domain/article.errors';

export interface UpdateArticleInput {
  id: string;
  image?: string | null;
  translations?: ArticleTranslationProps[];
}

export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: UpdateArticleInput): Promise<Article> {
    const article = await this.articleRepository.findById(input.id);
    
    if (!article) {
      throw new ArticleNotFoundError(input.id);
    }

    article.update({
      image: input.image,
      translations: input.translations,
    });
    await this.articleRepository.save(article);
    
    return article;
  }
}
