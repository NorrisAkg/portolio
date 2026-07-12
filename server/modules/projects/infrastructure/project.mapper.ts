import type { Project as PrismaProject, ProjectTranslation as PrismaProjectTranslation } from '@prisma/client';
import { Project } from '../domain/project.entity';

type PrismaProjectWithTranslations = PrismaProject & {
  translations: PrismaProjectTranslation[];
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
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
