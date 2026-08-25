import type { Project } from './project.entity';

export interface FindAllProjectsParams {
  featured?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ALL';
}

export interface ProjectRepository {
  findById(id: string): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  findAll(params: FindAllProjectsParams): Promise<Project[]>;
  save(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
}
