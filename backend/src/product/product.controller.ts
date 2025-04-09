import { Query, UseGuards } from '@nestjs/common';
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ProductService } from './product.service';

// @UseGuards(JwtAuthGuard, RolesGuard)
// no guard for public routes
@Controller('products')
export class ProductController {
  productModel: any;
  constructor(private productService: ProductService) { }

  // ✅ Public route: no guards
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query() query: any) {
    return this.productService.findAllPaginated(+page, +limit, query);
  }

  @Get('max-price')
  async getMaxPrice() {
    const products = await this.productService.findAll({});
    if (!products || products.length === 0) {
      return { max: 1000 }; // fallback default value
    }
    const prices = products.map((p) => p.price || 0);
    const max = Math.max(...prices);
    return { max };
  }

  // ✅ Public route: no guards
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }



  // ✅ Public route: no guards
  @UseGuards(JwtAuthGuard) // Only requires valid login
  @Post()
  create(@Body() body: any) {
    return this.productService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}