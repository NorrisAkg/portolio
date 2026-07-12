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
  tone: 'warm' | 'cool' | 'navy';
  year: string;
  dur: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  translations: ProjectTranslationProps[];
}
