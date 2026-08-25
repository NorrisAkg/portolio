import type { PrismaClient, Prisma } from '@prisma/client';
import type { ProjectRepository, FindAllProjectsParams } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';
import { ProjectMapper } from './project.mapper';
import type { PrismaProjectWithTranslations } from './project.mapper';

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findUnique({
      where: { id },
      include: { translations: true, technologies: true },
    });

    if (!prismaProject) return null;
    return ProjectMapper.toDomain(prismaProject as PrismaProjectWithTranslations);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findFirst({
      where: {
        translations: {
          some: { slug },
        },
      },
      include: { translations: true, technologies: true },
    });

    if (!prismaProject) return null;
    return ProjectMapper.toDomain(prismaProject as PrismaProjectWithTranslations);
  }

  async findAll(params: FindAllProjectsParams): Promise<Project[]> {
    const { featured, status } = params;
    const where: Prisma.ProjectWhereInput = {};
    if (featured !== undefined) {
      where.featured = featured;
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const prismaProjects = await this.prisma.project.findMany({
      where,
      include: { translations: true, technologies: true },
      orderBy: { createdAt: 'desc' },
    });

    return prismaProjects.map(p => ProjectMapper.toDomain(p as PrismaProjectWithTranslations));
  }

  async save(project: Project): Promise<void> {
    const props = project.toJSON();

    const techConnectDisconnect = props.technologies
      ? {
          set: props.technologies.map((t) => ({ id: t.id })),
        }
      : undefined;

    await this.prisma.project.upsert({
      where: { id: props.id },
      update: {
        image: props.image,
        tone: props.tone,
        year: props.year,
        dur: props.dur,
        githubUrl: props.githubUrl,
        liveUrl: props.liveUrl,
        featured: props.featured,
        status: props.status,
        publishedAt: props.publishedAt,
        updatedAt: new Date(),
        translations: {
          upsert: props.translations.map(t => ({
            where: {
              projectId_locale: {
                projectId: props.id,
                locale: t.locale,
              },
            },
            update: {
              title: t.title,
              slug: t.slug,
              description: t.description,
              content: t.content,
              outcome: t.outcome,
              durationLabel: t.durationLabel,
            },
            create: {
              locale: t.locale,
              title: t.title,
              slug: t.slug,
              description: t.description,
              content: t.content,
              outcome: t.outcome,
              durationLabel: t.durationLabel,
            },
          })),
        },
        technologies: techConnectDisconnect,
      },
      create: {
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
        translations: {
          create: props.translations.map(t => ({
            locale: t.locale,
            title: t.title,
            slug: t.slug,
            description: t.description,
            content: t.content,
            outcome: t.outcome,
            durationLabel: t.durationLabel,
          })),
        },
        technologies: props.technologies
          ? {
              connect: props.technologies.map((t) => ({ id: t.id })),
            }
          : undefined,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }
}
