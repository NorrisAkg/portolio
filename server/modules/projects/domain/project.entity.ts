import type { TechnologyProps } from '../../../../shared/types/project';

export interface ProjectTranslationProps {
  locale: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  outcome: string;
  durationLabel: string;
}

export type ProjectStatus = 'DRAFT' | 'PUBLISHED';

export interface ProjectProps {
  id: string;
  image: string | null;
  tone: string;
  year: string;
  dur: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: ProjectStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  translations: ProjectTranslationProps[];
  technologies?: TechnologyProps[];
}

export class Project {
  private constructor(private props: ProjectProps) {}

  public static create(props: ProjectProps): Project {
    return new Project(props);
  }

  // Getters
  public get id(): string { return this.props.id; }
  public get image(): string | null { return this.props.image; }
  public get tone(): string { return this.props.tone; }
  public get year(): string { return this.props.year; }
  public get dur(): string { return this.props.dur; }
  public get githubUrl(): string | null { return this.props.githubUrl; }
  public get liveUrl(): string | null { return this.props.liveUrl; }
  public get featured(): boolean { return this.props.featured; }
  public get status(): ProjectStatus { return this.props.status; }
  public get publishedAt(): Date | null { return this.props.publishedAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get translations(): ProjectTranslationProps[] { return this.props.translations; }
  public get technologies(): TechnologyProps[] | undefined { return this.props.technologies; }

  // Business methods
  public publish(): void {
    this.props.status = 'PUBLISHED';
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public unpublish(): void {
    this.props.status = 'DRAFT';
    this.props.updatedAt = new Date();
  }

  public update(data: Partial<Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    this.props = {
      ...this.props,
      image: data.image !== undefined ? data.image : this.props.image,
      tone: data.tone !== undefined ? data.tone : this.props.tone,
      year: data.year !== undefined ? data.year : this.props.year,
      dur: data.dur !== undefined ? data.dur : this.props.dur,
      githubUrl: data.githubUrl !== undefined ? data.githubUrl : this.props.githubUrl,
      liveUrl: data.liveUrl !== undefined ? data.liveUrl : this.props.liveUrl,
      featured: data.featured !== undefined ? data.featured : this.props.featured,
      status: data.status !== undefined ? data.status : this.props.status,
      publishedAt: data.publishedAt !== undefined ? data.publishedAt : this.props.publishedAt,
      translations: data.translations !== undefined ? data.translations : this.props.translations,
      technologies: data.technologies !== undefined ? data.technologies : this.props.technologies,
      updatedAt: new Date(),
    };
  }

  public toJSON(): ProjectProps {
    return { ...this.props };
  }
}
