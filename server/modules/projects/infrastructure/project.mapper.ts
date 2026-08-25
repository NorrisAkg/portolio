import type { Project as PrismaProject, ProjectTranslation as PrismaProjectTranslation, Technology as PrismaTechnology } from '@prisma/client';
import { Project } from '../domain/project.entity';

export type PrismaProjectWithTranslations = PrismaProject & {
  translations: PrismaProjectTranslation[];
  technologies?: PrismaTechnology[];
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProjectMapper {
  static toDomain(prismaProject: PrismaProjectWithTranslations): Project {
    return Project.create({
      id: prismaProject.id,
      image: prismaProject.image,
      tone: prismaProject.tone,
      year: prismaProject.year,
      dur: prismaProject.dur,
      githubUrl: prismaProject.githubUrl,
      liveUrl: prismaProject.liveUrl,
      featured: prismaProject.featured,
      status: (prismaProject.status as 'DRAFT' | 'PUBLISHED') || 'DRAFT',
      publishedAt: prismaProject.publishedAt,
      createdAt: prismaProject.createdAt,
      updatedAt: prismaProject.updatedAt,
      translations: prismaProject.translations.map(t => ({
        locale: t.locale,
        title: t.title,
        slug: t.slug,
        description: t.description,
        content: t.content,
        outcome: t.outcome,
        durationLabel: t.durationLabel,
      })),
      technologies: prismaProject.technologies?.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        icon: t.icon,
      })),
    });
  }

  static toPrisma(project: Project): PrismaProject {
    const props = project.toJSON();
    return {
      id: props.id,
      image: props.image,
      tone: props.tone,
      year: props.year,
      dur: props.dur,
      githubUrl: props.githubUrl,
      liveUrl: props.liveUrl,
      featured: props.featured,
      status: props.status,
      publishedAt: props.publishedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
