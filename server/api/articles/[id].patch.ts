import { z } from 'zod';
import { UpdateArticleUseCase } from '../../modules/articles/application/update-article.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().url().optional().nullable(),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);
    
    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
    
    const useCase = useContainer().resolve<UpdateArticleUseCase>('UpdateArticleUseCase');
    const article = await useCase.execute({
      id: params.id,
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content,
      image: body.image,
    });

    return article.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.errors });
    }
    handleDomainError(error);
  }
});
