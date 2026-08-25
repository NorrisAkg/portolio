import { z } from 'zod';
import type { PublishProjectUseCase } from '../../modules/projects/application/publish-project.use-case';
import type { UnpublishProjectUseCase } from '../../modules/projects/application/unpublish-project.use-case';
import type { DeleteProjectUseCase } from '../../modules/projects/application/delete-project.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const bodySchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'Au moins un élément doit être sélectionné'),
  action: z.enum(['publish', 'unpublish', 'delete']),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
    const container = useContainer();

    if (body.action === 'publish') {
      const useCase = container.resolve<PublishProjectUseCase>('PublishProjectUseCase');
      for (const id of body.ids) {
        await useCase.execute({ id });
      }
    } else if (body.action === 'unpublish') {
      const useCase = container.resolve<UnpublishProjectUseCase>('UnpublishProjectUseCase');
      for (const id of body.ids) {
        await useCase.execute({ id });
      }
    } else if (body.action === 'delete') {
      const useCase = container.resolve<DeleteProjectUseCase>('DeleteProjectUseCase');
      for (const id of body.ids) {
        await useCase.execute({ id });
      }
    }

    return {
      success: true,
      count: body.ids.length,
      action: body.action,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    return handleDomainError(error, event);
  }
});
