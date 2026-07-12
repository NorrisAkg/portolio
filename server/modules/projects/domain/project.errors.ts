import { DomainError } from '../../../shared/errors/domain.error';

export class ProjectNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Projet introuvable pour le slug: ${slug}`, 'PROJECT_NOT_FOUND', 404);
  }
}
