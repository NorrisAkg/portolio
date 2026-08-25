import type { ProjectRepository } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';
import { ProjectNotFoundError } from '../domain/project.errors';

export interface PublishProjectInput {
  id: string;
}

export class PublishProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: PublishProjectInput): Promise<Project> {
    const project = await this.projectRepository.findById(input.id);

    if (!project) {
      throw new ProjectNotFoundError(input.id);
    }

    project.publish();
    await this.projectRepository.save(project);

    return project;
  }
}
