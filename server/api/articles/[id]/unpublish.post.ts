import { z } from 'zod';
import type { UnpublishArticleUseCase } from '../../../modules/articles/application/unpublish-article.use-case';
import { handleDomainError } from '../../../utils/handle-errors';
import { useContainer } from '../../../utils/use-container';

const paramsSchema = z.object({
  id: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);
    
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    
    const useCase = useContainer().resolve<UnpublishArticleUseCase>('UnpublishArticleUseCase');
    const article = await useCase.execute({ id: params.id });

    return article.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    return handleDomainError(error, event);
  }
});
