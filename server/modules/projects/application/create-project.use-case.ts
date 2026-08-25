import type { ProjectRepository } from '../domain/project.repository';
import type { ProjectTranslationProps } from '../domain/project.entity';
import { Project } from '../domain/project.entity';
import { randomUUID } from 'crypto';

export interface CreateProjectInput {
  image?: string | null;
  tone?: string;
  year: string;
  dur: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  translations: ProjectTranslationProps[];
  technologyIds?: string[];
}

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    const now = new Date();

    const project = Project.create({
      id: randomUUID(),
      image: input.image ?? null,
      tone: input.tone ?? 'cool',
      year: input.year,
      dur: input.dur,
      githubUrl: input.githubUrl ?? null,
      liveUrl: input.liveUrl ?? null,
      featured: input.featured ?? false,
      status: 'DRAFT',
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      translations: input.translations,
      technologies: input.technologyIds?.map(id => ({ id, name: '', slug: '', icon: null })),
    });

    await this.projectRepository.save(project);

    return project;
  }
}
