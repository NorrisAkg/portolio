export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export interface ArticleTranslationProps {
  locale: string;
  title: string;
  slug: string;
  description: string;
  content: string;
}

export interface ArticleProps {
  id: string;
  image: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: ArticleTranslationProps[];
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
