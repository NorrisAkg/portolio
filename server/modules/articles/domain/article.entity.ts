import { ArticleAlreadyPublishedError, InvalidArticleStatusError } from './article.errors';

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
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  translations: ArticleTranslationProps[];
}

export class Article {
  private constructor(private props: ArticleProps) {}

  public static create(props: ArticleProps): Article {
    if (props.status !== 'DRAFT' && props.status !== 'PUBLISHED') {
      throw new InvalidArticleStatusError(props.status);
    }
    return new Article(props);
  }

  // Getters
  public get id(): string { return this.props.id; }
  public get image(): string | null { return this.props.image; }
  public get status(): ArticleStatus { return this.props.status; }
  public get publishedAt(): Date | null { return this.props.publishedAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get translations(): ArticleTranslationProps[] { return this.props.translations; }

  // Business methods
  public publish(): void {
    if (this.props.status === 'PUBLISHED') {
      throw new ArticleAlreadyPublishedError(this.id);
    }
    this.props.status = 'PUBLISHED';
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public unpublish(): void {
    this.props.status = 'DRAFT';
    this.props.updatedAt = new Date();
  }

  public update(data: Partial<Pick<ArticleProps, 'image'>> & { translations?: ArticleTranslationProps[] }): void {
    this.props = {
      ...this.props,
      image: data.image !== undefined ? data.image : this.props.image,
      translations: data.translations !== undefined ? data.translations : this.props.translations,
      updatedAt: new Date()
    };
  }

  public toJSON(): ArticleProps {
    return { ...this.props };
  }
}
