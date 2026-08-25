import type { ProjectRepository } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';
import { ProjectNotFoundError } from '../domain/project.errors';

export interface UnpublishProjectInput {
  id: string;
}

export class UnpublishProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: UnpublishProjectInput): Promise<Project> {
    const project = await this.projectRepository.findById(input.id);

    if (!project) {
      throw new ProjectNotFoundError(input.id);
    }

    project.unpublish();
    await this.projectRepository.save(project);

    return project;
  }
}
