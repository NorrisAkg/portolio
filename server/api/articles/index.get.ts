import { z } from 'zod';
import { ListArticlesUseCase } from '../../modules/articles/application/list-articles.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const query = await getValidatedQuery(event, (data) => querySchema.parse(data));
    
    // Only admins can see DRAFT articles
    if (query.status === 'DRAFT') {
      await requireAdmin(event);
    } else {
      // By default, public API only returns PUBLISHED articles
      query.status = 'PUBLISHED';
    }

    const useCase = useContainer().resolve<ListArticlesUseCase>('ListArticlesUseCase');
    const result = await useCase.execute({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });

    return {
      data: result.data.map(a => a.toJSON()),
      meta: result.meta,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.errors });
    }
    handleDomainError(error);
  }
});
