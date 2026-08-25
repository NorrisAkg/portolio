import { z } from 'zod';
import type { CreateArticleUseCase } from '../../modules/articles/application/create-article.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const bodySchema = z.object({
  image: z.string().url().optional().nullable(),
  translations: z.array(z.object({
    locale: z.string().min(2).max(5),
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string(),
    content: z.string(),
  })).min(1),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);
    
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));
    
    const useCase = useContainer().resolve<CreateArticleUseCase>('CreateArticleUseCase');
    const article = await useCase.execute({
      image: body.image,
      translations: body.translations,
    });

    setResponseStatus(event, 201);
    return article.toJSON();
  } catch (error) {
    handleDomainError(error, event);
  }
});
