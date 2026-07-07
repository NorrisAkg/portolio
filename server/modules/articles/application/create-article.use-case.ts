import { ArticleRepository } from '../domain/article.repository';
import { Article } from '../domain/article.entity';
import { randomUUID } from 'crypto';

export interface CreateArticleInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string | null;
}

export class CreateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<Article> {
    const now = new Date();
    
    const article = Article.create({
      id: randomUUID(),
      title: input.title,
      slug: input.slug,
      description: input.description,
      content: input.content,
      image: input.image ?? null,
      status: 'DRAFT',
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    await this.articleRepository.save(article);
    
    return article;
  }
}
