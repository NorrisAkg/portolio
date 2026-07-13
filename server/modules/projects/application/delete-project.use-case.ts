import type { ProjectRepository } from '../domain/project.repository';
import { ProjectNotFoundError } from '../domain/project.errors';

export interface DeleteProjectInput {
  id: string;
}

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: DeleteProjectInput): Promise<void> {
    const project = await this.projectRepository.findById(input.id);

    if (!project) {
      throw new ProjectNotFoundError(input.id);
    }

    await this.projectRepository.delete(input.id);
  }
}
