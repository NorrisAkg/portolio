import { z } from 'zod';
import type { DeleteProjectUseCase } from '../../modules/projects/application/delete-project.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));

    const useCase = useContainer().resolve<DeleteProjectUseCase>('DeleteProjectUseCase');
    await useCase.execute({ id: params.id });

    setResponseStatus(event, 204);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    handleDomainError(error);
  }
});
