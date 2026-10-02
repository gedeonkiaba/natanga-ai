import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/children.dto';

/**
 * Endpoints profils enfants — US-02.
 * Note (Sprint 1) : l'identité du parent est passée en en-tête `x-user-id`
 * (simplification ; JWT/RBAC complet viendra avec le module d'auth finalisé).
 */
@Controller('children')
export class ChildrenController {
  constructor(private readonly children: ChildrenService) {}

  @Post()
  create(@Body() dto: CreateChildDto, @Headers('x-user-id') userId: string) {
    return this.children.create(userId, dto);
  }

  @Get()
  list(@Headers('x-user-id') userId: string) {
    return this.children.listForParent(userId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.children.findById(id);
  }
}
