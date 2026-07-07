import { Article } from './article.entity';

export interface FindAllParams {
  page: number;
  limit: number;
  status?: 'DRAFT' | 'PUBLISHED';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ArticleRepository {
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findAll(params: FindAllParams): Promise<PaginatedResult<Article>>;
  save(article: Article): Promise<void>;
  delete(id: string): Promise<void>;
}
