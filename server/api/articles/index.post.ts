import { z } from 'zod';
import type { CreateArticleUseCase } from '../../modules/articles/application/create-article.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const bodySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  content: z.string(),
  image: z.string().url().optional().nullable(),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);
    
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
    
    const useCase = useContainer().resolve<CreateArticleUseCase>('CreateArticleUseCase');
    const article = await useCase.execute({
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content,
      image: body.image,
    });

    setResponseStatus(event, 201);
    return article.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    handleDomainError(error);
  }
});
