import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { CategoriesService } from '../categories/categories.service.js';
import { PrismaService } from '../prisma.service.js';
import type {
  CreateTransactionDto,
  ListTransactionsQuery,
  UpdateTransactionDto,
} from './dto.js';

const FORMULA_START = /^[=+\-@\t\r]/;

// Escapa um campo CSV e neutraliza formulas (CSV injection) em planilhas.
function csvField(value: string): string {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) || safe !== value
    ? `"${safe.replace(/"/g, '""')}"`
    : safe;
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categories: CategoriesService,
  ) {}

  private where(userId: number, q: ListTransactionsQuery = {}) {
    const where: Prisma.TransactionWhereInput = { userId };
    if (q.type) where.type = q.type;
    if (q.categoryId) where.categoryId = q.categoryId;
    if (q.from || q.to) {
      where.date = {
        ...(q.from ? { gte: new Date(q.from) } : {}),
        ...(q.to ? { lte: new Date(q.to) } : {}),
      };
    }
    return where;
  }

  list(userId: number, q: ListTransactionsQuery) {
    return this.prisma.transaction.findMany({
      where: this.where(userId, q),
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
    });
  }

  async get(userId: number, id: number) {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!tx) throw new NotFoundException('Movimentacao nao encontrada');
    return tx;
  }

  async create(userId: number, dto: CreateTransactionDto) {
    await this.categories.findOwned(userId, dto.categoryId);
    return this.prisma.transaction.create({
      data: { ...dto, date: new Date(dto.date), userId },
    });
  }

  async update(userId: number, id: number, dto: UpdateTransactionDto) {
    await this.get(userId, id);
    if (dto.categoryId) await this.categories.findOwned(userId, dto.categoryId);
    return this.prisma.transaction.update({
      where: { id },
      data: { ...dto, ...(dto.date ? { date: new Date(dto.date) } : {}) },
    });
  }

  async remove(userId: number, id: number) {
    await this.get(userId, id);
    await this.prisma.transaction.delete({ where: { id } });
    return { deleted: true };
  }

  // RN09: entradas somam, saidas subtraem
  async summary(userId: number, q: ListTransactionsQuery) {
    const groups = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: this.where(userId, q),
      _sum: { amount: true },
    });
    const sum = (t: string) =>
      groups.find((g) => g.type === t)?._sum.amount ?? new Prisma.Decimal(0);
    const income = sum('INCOME');
    const expense = sum('EXPENSE');
    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: income.minus(expense).toFixed(2),
    };
  }

  // RN12: exportacao CSV
  async exportCsv(userId: number, q: ListTransactionsQuery) {
    const rows = await this.list(userId, q);
    const lines = rows.map((r) =>
      [
        r.date.toISOString().slice(0, 10),
        r.type === 'INCOME' ? 'Entrada' : 'Saida',
        csvField(r.description),
        csvField(r.category.name),
        r.amount.toFixed(2),
      ].join(','),
    );
    return '﻿' + ['Data,Tipo,Descricao,Categoria,Valor', ...lines].join('\r\n');
  }
}
