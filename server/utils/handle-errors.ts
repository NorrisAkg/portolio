import { DomainError } from '~~/server/shared/errors/domain.error'

export const handleDomainError = (error: unknown): never => {
  if (error instanceof DomainError) {
    throw createError({
      statusCode: error.httpStatus,
      statusMessage: error.code,
      message: error.message,
    })
  }
  throw error
}
