import { z } from 'zod';
import type { CreateProjectUseCase } from '../../modules/projects/application/create-project.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const bodySchema = z.object({
  image: z.string().optional().nullable(),
  tone: z.enum(['warm', 'cool', 'navy']).optional(),
  year: z.string().min(1),
  dur: z.string().min(1),
  githubUrl: z.string().url().or(z.literal('')).optional().nullable(),
  liveUrl: z.string().url().or(z.literal('')).optional().nullable(),
  featured: z.boolean().optional(),
  translations: z.array(z.object({
    locale: z.string().min(2).max(5),
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string(),
    content: z.string(),
    outcome: z.string(),
    durationLabel: z.string(),
  })).min(1),
  technologyIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

    const useCase = useContainer().resolve<CreateProjectUseCase>('CreateProjectUseCase');
    const project = await useCase.execute({
      image: body.image,
      tone: body.tone,
      year: body.year,
      dur: body.dur,
      githubUrl: body.githubUrl || null,
      liveUrl: body.liveUrl || null,
      featured: body.featured,
      translations: body.translations,
      technologyIds: body.technologyIds,
    });

    setResponseStatus(event, 201);
    return project.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    handleDomainError(error);
  }
});
