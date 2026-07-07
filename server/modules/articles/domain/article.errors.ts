import { DomainError } from '../../../shared/errors/domain.error';

export class ArticleNotFoundError extends DomainError {
  constructor(idOrSlug: string) {
    super(`Article with id or slug ${idOrSlug} not found`, 'ARTICLE_NOT_FOUND', 404);
  }
}

export class ArticleAlreadyPublishedError extends DomainError {
  constructor(id: string) {
    super(`Article ${id} is already published`, 'ARTICLE_ALREADY_PUBLISHED', 400);
  }
}

export class InvalidArticleStatusError extends DomainError {
  constructor(status: string) {
    super(`Invalid article status: ${status}`, 'INVALID_ARTICLE_STATUS', 400);
  }
}
