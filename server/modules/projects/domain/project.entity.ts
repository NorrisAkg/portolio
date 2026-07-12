export interface ProjectTranslationProps {
  locale: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  outcome: string;
  durationLabel: string;
}

export interface ProjectProps {
  id: string;
  image: string | null;
  tone: string;
  year: string;
  dur: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations: ProjectTranslationProps[];
}

export class Project {
  private constructor(private readonly props: ProjectProps) {}

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
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public get translations(): ProjectTranslationProps[] { return this.props.translations; }

  public toJSON(): ProjectProps {
    return { ...this.props };
  }
}
