import { container } from '../shared/container';
import { prisma } from '../shared/prisma';
import { PrismaArticleRepository } from '../modules/articles/infrastructure/prisma-article.repository';
import { ListArticlesUseCase } from '../modules/articles/application/list-articles.use-case';
import { GetArticleUseCase } from '../modules/articles/application/get-article.use-case';
import { CreateArticleUseCase } from '../modules/articles/application/create-article.use-case';
import { PublishArticleUseCase } from '../modules/articles/application/publish-article.use-case';
import { UpdateArticleUseCase } from '../modules/articles/application/update-article.use-case';
import { DeleteArticleUseCase } from '../modules/articles/application/delete-article.use-case';

import { PrismaProjectRepository } from '../modules/projects/infrastructure/prisma-project.repository';
import { ListProjectsUseCase } from '../modules/projects/application/list-projects.use-case';
import { GetProjectUseCase } from '../modules/projects/application/get-project.use-case';

export default defineNitroPlugin(() => {
  // Repositories
  const articleRepository = new PrismaArticleRepository(prisma);
  container.register('ArticleRepository', articleRepository);

  const projectRepository = new PrismaProjectRepository(prisma);
  container.register('ProjectRepository', projectRepository);

  // Use Cases
  container.register('ListArticlesUseCase', new ListArticlesUseCase(articleRepository));
  container.register('GetArticleUseCase', new GetArticleUseCase(articleRepository));
  container.register('CreateArticleUseCase', new CreateArticleUseCase(articleRepository));
  container.register('PublishArticleUseCase', new PublishArticleUseCase(articleRepository));
  container.register('UpdateArticleUseCase', new UpdateArticleUseCase(articleRepository));
  container.register('DeleteArticleUseCase', new DeleteArticleUseCase(articleRepository));

  container.register('ListProjectsUseCase', new ListProjectsUseCase(projectRepository));
  container.register('GetProjectUseCase', new GetProjectUseCase(projectRepository));

  console.log('[DI] Dependencies registered.');
});
