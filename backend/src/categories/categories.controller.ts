import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, type AuthRequest } from '../auth/auth.guard.js';
import { CategoriesService } from './categories.service.js';
import { CategoryDto } from './dto.js';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.categories.list(req.user.id);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CategoryDto) {
    return this.categories.create(req.user.id, dto.name);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CategoryDto,
  ) {
    return this.categories.update(req.user.id, id, dto.name);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Query('reassignTo') reassignTo?: string,
  ) {
    return this.categories.remove(
      req.user.id,
      id,
      reassignTo === undefined ? undefined : Number(reassignTo),
    );
  }
}
