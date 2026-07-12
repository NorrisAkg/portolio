import type { ProjectRepository } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';
import { ProjectNotFoundError } from '../domain/project.errors';

export interface GetProjectInput {
  slug: string;
}

export class GetProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: GetProjectInput): Promise<Project> {
    const project = await this.projectRepository.findBySlug(input.slug);

    if (!project) {
      throw new ProjectNotFoundError(input.slug);
    }

    return project;
  }
}
