import { prisma } from '../../shared/prisma';

export default defineEventHandler(async () => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: 'asc' },
    });
    return technologies;
  } catch (error) {
    console.error('[API Technologies] Error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
