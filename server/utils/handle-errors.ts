import { DomainError } from '../shared/errors/domain.error';

export function handleDomainError(error: unknown) {
  if (error instanceof DomainError) {
    throw createError({
      statusCode: error.httpStatus,
      statusMessage: error.message,
      data: {
        code: error.code,
      },
    });
  }

  console.error('[Unhandled Error]', error);
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
  });
}
