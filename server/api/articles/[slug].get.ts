import { z } from 'zod';
import type { GetArticleUseCase } from '../../modules/articles/application/get-article.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const paramsSchema = z.object({
  id: z.string(), // Nitro maps the route parameter to 'id' because of the sibling [id]/ folder
});

export default defineEventHandler(async (event) => {
  try {
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    
    const useCase = useContainer().resolve<GetArticleUseCase>('GetArticleUseCase');
    const article = await useCase.execute({ slug: params.id });

    // Only admins can see DRAFT articles
    if (article.status === 'DRAFT') {
      await requireAdmin(event);
    }

    return article.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    handleDomainError(error);
  }
});
