import { DomainError } from '../../../shared/errors/domain.error';

export class ProjectNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Projet introuvable pour l'identifiant / slug : ${identifier}`, 'PROJECT_NOT_FOUND', 404);
  }
}
