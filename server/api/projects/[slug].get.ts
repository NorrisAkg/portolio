import { z } from 'zod';
import type { GetProjectUseCase } from '../../modules/projects/application/get-project.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const paramsSchema = z.object({
  slug: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    
    const useCase = useContainer().resolve<GetProjectUseCase>('GetProjectUseCase');
    const project = await useCase.execute({ slug: params.slug });

    return project.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    handleDomainError(error);
  }
});
