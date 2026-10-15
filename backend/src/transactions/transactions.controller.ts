import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, type AuthRequest } from '../auth/auth.guard.js';
import {
  CreateTransactionDto,
  ListTransactionsQuery,
  UpdateTransactionDto,
} from './dto.js';
import { TransactionsService } from './transactions.service.js';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}

  @Get()
  list(@Req() req: AuthRequest, @Query() q: ListTransactionsQuery) {
    return this.transactions.list(req.user.id, q);
  }

  @Get('summary')
  summary(@Req() req: AuthRequest, @Query() q: ListTransactionsQuery) {
    return this.transactions.summary(req.user.id, q);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="movimentacoes.csv"')
  exportCsv(@Req() req: AuthRequest, @Query() q: ListTransactionsQuery) {
    return this.transactions.exportCsv(req.user.id, q);
  }

  @Get(':id')
  get(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.transactions.get(req.user.id, id);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateTransactionDto) {
    return this.transactions.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactions.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.transactions.remove(req.user.id, id);
  }
}
