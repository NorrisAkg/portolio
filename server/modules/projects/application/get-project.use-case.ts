import type { ProjectRepository } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';
import { ProjectNotFoundError } from '../domain/project.errors';

export interface GetProjectInput {
  slug?: string;
  id?: string;
}

export class GetProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: GetProjectInput): Promise<Project> {
    let project: Project | null = null;

    if (input.id) {
      project = await this.projectRepository.findById(input.id);
    }

    if (!project && input.slug) {
      project = await this.projectRepository.findBySlug(input.slug);
      // Fallback: also try findById with the slug param in case an ID was passed in the slug route
      if (!project) {
        project = await this.projectRepository.findById(input.slug);
      }
    }

    if (!project) {
      throw new ProjectNotFoundError(input.id || input.slug || 'inconnu');
    }

    return project;
  }
}
