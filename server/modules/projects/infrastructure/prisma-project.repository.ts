import type { PrismaClient } from '@prisma/client';
import type { ProjectRepository, FindAllProjectsParams } from '../domain/project.repository';
import type { Project } from '../domain/project.entity';
import { ProjectMapper } from './project.mapper';

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!prismaProject) return null;
    return ProjectMapper.toDomain(prismaProject as any);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findFirst({
      where: {
        translations: {
          some: { slug },
        },
      },
      include: { translations: true },
    });

    if (!prismaProject) return null;
    return ProjectMapper.toDomain(prismaProject as any);
  }

  async findAll(params: FindAllProjectsParams): Promise<Project[]> {
    const { featured } = params;
    const where: any = {};
    if (featured !== undefined) {
      where.featured = featured;
    }

    const prismaProjects = await this.prisma.project.findMany({
      where,
      include: { translations: true },
      orderBy: { createdAt: 'desc' },
    });

    return prismaProjects.map(p => ProjectMapper.toDomain(p as any));
  }
}
