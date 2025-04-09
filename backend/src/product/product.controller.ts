import { UseGuards } from '@nestjs/common';
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ProductService } from './product.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return this.productService.create(body);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
