import { z } from 'zod';
import type { UpdateProjectUseCase } from '../../modules/projects/application/update-project.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const paramsSchema = z.object({
  id: z.string().min(1),
});

const bodySchema = z.object({
  image: z.string().optional().nullable(),
  tone: z.enum(['warm', 'cool', 'navy']).optional(),
  year: z.string().min(1).optional(),
  dur: z.string().min(1).optional(),
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
  })).optional(),
  technologyIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event);

    const params = await getValidatedRouterParams(event, (data) => paramsSchema.parse(data));
    const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

    const useCase = useContainer().resolve<UpdateProjectUseCase>('UpdateProjectUseCase');
    const project = await useCase.execute({
      id: params.id,
      image: body.image,
      tone: body.tone,
      year: body.year,
      dur: body.dur,
      githubUrl: body.githubUrl !== undefined ? (body.githubUrl || null) : undefined,
      liveUrl: body.liveUrl !== undefined ? (body.liveUrl || null) : undefined,
      featured: body.featured,
      translations: body.translations,
      technologyIds: body.technologyIds,
    });

    return project.toJSON();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: error.issues });
    }
    return handleDomainError(error, event);
  }
});
