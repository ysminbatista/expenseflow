import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: number, name: string) {
    name = name.trim();
    await this.assertNameFree(userId, name);
    return this.prisma.category.create({ data: { name, userId } });
  }

  async update(userId: number, id: number, name: string) {
    name = name.trim();
    await this.findOwned(userId, id);
    await this.assertNameFree(userId, name, id);
    return this.prisma.category.update({ where: { id }, data: { name } });
  }

  // RN05: categoria em uso so e removida se as movimentacoes forem
  // reatribuidas a outra categoria do mesmo usuario.
  async remove(userId: number, id: number, reassignTo?: number) {
    await this.findOwned(userId, id);
    const inUse = await this.prisma.transaction.count({
      where: { categoryId: id, userId },
    });

    if (inUse === 0) {
      await this.prisma.category.delete({ where: { id } });
      return { deleted: true, reassigned: 0 };
    }

    if (reassignTo === undefined || Number.isNaN(reassignTo)) {
      throw new ConflictException(
        `Categoria usada por ${inUse} movimentação(ões). Informe reassignTo com a categoria de destino.`,
      );
    }
    if (reassignTo === id) {
      throw new ConflictException('A categoria de destino deve ser outra');
    }
    await this.findOwned(userId, reassignTo);
    await this.prisma.$transaction([
      this.prisma.transaction.updateMany({
        where: { categoryId: id, userId },
        data: { categoryId: reassignTo },
      }),
      this.prisma.category.delete({ where: { id } }),
    ]);
    return { deleted: true, reassigned: inUse };
  }

  // RN03: devolve 404 tambem para categoria de outro usuario
  async findOwned(userId: number, id: number) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }

  private async assertNameFree(
    userId: number,
    name: string,
    exceptId?: number,
  ) {
    const dup = await this.prisma.category.findFirst({
      where: {
        userId,
        name: { equals: name, mode: 'insensitive' },
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
    });
    if (dup) {
      throw new ConflictException('Já existe uma categoria com esse nome');
    }
  }
}
