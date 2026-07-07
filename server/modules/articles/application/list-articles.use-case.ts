import type { ArticleRepository, PaginatedResult } from '../domain/article.repository';
import type { Article } from '../domain/article.entity';

export interface ListArticlesInput {
  page: number;
  limit: number;
  status?: 'DRAFT' | 'PUBLISHED';
}

export class ListArticlesUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: ListArticlesInput): Promise<PaginatedResult<Article>> {
    return this.articleRepository.findAll(input);
  }
}
