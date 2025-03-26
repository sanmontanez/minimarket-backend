import {
    Controller,Post, Body,UseGuards,Req,Get,Put,Delete,Param,ParseIntPipe,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() body: { name: string; price: number; stock: number },
    @Req() req
  ) {
    return this.productsService.create(body, req.user);
  }

  @Get()
  async getMyProducts(@Req() req) {
    return this.productsService.findAllByUser(req.user);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; price?: number; stock?: number },
    @Req() req
  ) {
    return this.productsService.updateProduct(id, body, req.user);
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    return this.productsService.deleteProduct(id, req.user);
  }
}