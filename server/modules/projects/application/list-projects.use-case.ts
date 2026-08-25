import type { ProjectRepository } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';

export interface ListProjectsInput {
  featured?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ALL';
}

export class ListProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: ListProjectsInput): Promise<Project[]> {
    return this.projectRepository.findAll(input);
  }
}
