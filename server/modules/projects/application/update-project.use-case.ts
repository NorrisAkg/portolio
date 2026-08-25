import type { ProjectRepository } from '../domain/project.repository';
import type { Project, ProjectTranslationProps } from '../domain/project.entity';
import { ProjectNotFoundError } from '../domain/project.errors';
import type { TechnologyProps } from '../../../../shared/types/project';

export interface UpdateProjectInput {
  id: string;
  image?: string | null;
  tone?: string;
  year?: string;
  dur?: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  translations?: ProjectTranslationProps[];
  technologies?: TechnologyProps[];
  technologyIds?: string[];
}

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    const project = await this.projectRepository.findById(input.id);

    if (!project) {
      throw new ProjectNotFoundError(input.id);
    }

    const technologies = input.technologies ?? (input.technologyIds ? input.technologyIds.map(id => ({ id, name: '', slug: '', icon: null })) : undefined);

    project.update({
      image: input.image,
      tone: input.tone,
      year: input.year,
      dur: input.dur,
      githubUrl: input.githubUrl,
      liveUrl: input.liveUrl,
      featured: input.featured,
      translations: input.translations,
      technologies,
    });

    await this.projectRepository.save(project);

    return project;
  }
}
