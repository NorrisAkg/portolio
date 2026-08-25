import type { H3Event } from 'h3';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DomainError } from '../shared/errors/domain.error';
import { logger } from './logger';

export function handleDomainError(error: unknown, event?: H3Event) {
  const context = event
    ? {
        path: event.path,
        method: event.method,
      }
    : undefined;

  // 1. If it's already an H3 error (e.g. from createError with status < 500)
  if (
    error &&
    typeof error === 'object' &&
    'statusCode' in error &&
    typeof (error as Record<string, unknown>).statusCode === 'number' &&
    ((error as Record<string, unknown>).statusCode as number) < 500
  ) {
    throw error;
  }

  // 2. DomainError
  if (error instanceof DomainError) {
    logger.warn(`[Domain Error] ${error.message}`, {
      ...context,
      code: error.code,
      statusCode: error.httpStatus,
    });
    throw createError({
      statusCode: error.httpStatus,
      statusMessage: error.message,
      message: error.message,
      data: {
        code: error.code,
      },
    });
  }

  // 3. Zod validation error
  if (error instanceof z.ZodError) {
    const formattedIssues = error.issues
      .map((i) => `${i.path.join('.') || 'racine'}: ${i.message}`)
      .join(', ');
    const message = `Validation échouée : ${formattedIssues}`;
    logger.warn(`[Validation Error] ${message}`, {
      ...context,
      issues: error.issues,
      statusCode: 400,
    });
    throw createError({
      statusCode: 400,
      statusMessage: message,
      message,
      data: error.issues,
    });
  }

  // 4. Prisma known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1001 / P1000: Can't reach database server
    if (error.code === 'P1001' || error.code === 'P1000') {
      const message =
        'Impossible de joindre le serveur de base de données. Veuillez vérifier que PostgreSQL est démarré.';
      logger.error(`[Prisma Connection Error] ${message}`, error, context);
      throw createError({
        statusCode: 503,
        statusMessage: message,
        message,
        data: { code: error.code },
      });
    }

    // P2002: Unique constraint failed
    if (error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target)
        ? (error.meta.target as string[]).join(', ')
        : (error.meta?.target as string) || 'champ unique';
      const message = `Un élément avec cette valeur (${target}) existe déjà pour cette langue.`;
      logger.warn(`[Prisma Unique Constraint] ${message}`, {
        ...context,
        meta: error.meta,
        code: error.code,
        statusCode: 409,
      });
      throw createError({
        statusCode: 409,
        statusMessage: message,
        message,
        data: {
          code: 'UNIQUE_CONSTRAINT_FAILED',
          target: error.meta?.target,
        },
      });
    }

    // P2025: Record not found
    if (error.code === 'P2025') {
      const message = "L'enregistrement demandé est introuvable.";
      logger.warn(`[Prisma Not Found] ${message}`, {
        ...context,
        code: error.code,
        statusCode: 404,
      });
      throw createError({
        statusCode: 404,
        statusMessage: message,
        message,
        data: { code: 'RECORD_NOT_FOUND' },
      });
    }

    // P2003: Foreign key constraint failed
    if (error.code === 'P2003') {
      const field = (error.meta?.field_name as string) || 'relation';
      const message = `Une référence liée (${field}) est invalide ou introuvable.`;
      logger.warn(`[Prisma Foreign Key] ${message}`, {
        ...context,
        meta: error.meta,
        code: error.code,
        statusCode: 400,
      });
      throw createError({
        statusCode: 400,
        statusMessage: message,
        message,
        data: { code: 'FOREIGN_KEY_FAILED', field },
      });
    }
  }

  // 5. Prisma validation error
  if (error instanceof Prisma.PrismaClientValidationError) {
    const message = 'Données de requête invalides pour la base de données.';
    logger.error(`[Prisma Validation Error] ${error.message}`, error, context);
    throw createError({
      statusCode: 400,
      statusMessage: message,
      message,
    });
  }

  // 6. Unhandled / Unexpected Server Error
  logger.error('[Unhandled Server Error]', error, context);

  const isDev = process.env.NODE_ENV !== 'production';
  const errorMessage =
    isDev && error instanceof Error
      ? error.message
      : 'Une erreur interne du serveur est survenue.';

  throw createError({
    statusCode: 500,
    statusMessage: errorMessage,
    message: errorMessage,
  });
}
