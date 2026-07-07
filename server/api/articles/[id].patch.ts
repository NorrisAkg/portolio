import { z } from 'zod';
import type { UpdateArticleUseCase } from '../../modules/articles/application/update-article.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  image: z.string().url().optional().nullable(),
  translations: z.array(z.object({
    locale: z.string().min(2).max(5),
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string(),
    content: z.string(),
  })).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);
    
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
    
    const useCase = useContainer().resolve<UpdateArticleUseCase>('UpdateArticleUseCase');
    const article = await useCase.execute({
      id: params.id,
      image: body.image,
      translations: body.translations,
    });

    return article.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    handleDomainError(error);
  }
});
