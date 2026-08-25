import { z } from 'zod';
import type { ListProjectsUseCase } from '../../modules/projects/application/list-projects.use-case';
import { handleDomainError } from '../../utils/handle-errors';
import { useContainer } from '../../utils/use-container';

const querySchema = z.object({
  featured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ALL']).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const query = await getValidatedQuery(event, (data) => querySchema.parse(data));
    
    const useCase = useContainer().resolve<ListProjectsUseCase>('ListProjectsUseCase');
    const result = await useCase.execute({
      featured: query.featured,
      status: query.status ?? 'PUBLISHED',
    });

    return result.map(p => p.toJSON());
  } catch (error) {
    return handleDomainError(error, event);
  }
});
