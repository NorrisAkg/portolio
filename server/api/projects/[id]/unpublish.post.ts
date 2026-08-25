import { z } from 'zod';
import type { UnpublishProjectUseCase } from '../../../modules/projects/application/unpublish-project.use-case';
import { handleDomainError } from '../../../utils/handle-errors';
import { useContainer } from '../../../utils/use-container';

const paramsSchema = z.object({
  id: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);
    
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    
    const useCase = useContainer().resolve<UnpublishProjectUseCase>('UnpublishProjectUseCase');
    const project = await useCase.execute({ id: params.id });

    return project.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    return handleDomainError(error, event);
  }
});
