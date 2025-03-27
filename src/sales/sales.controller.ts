import { Controller, Post, Body, Req, UseGuards, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SalesService } from './sales.service';

@Controller('sales')
@UseGuards(AuthGuard('jwt'))
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(
    @Body() body: { productId: number; quantity: number },
    @Req() req
  ) {
    const { productId, quantity } = body;
    return this.salesService.createSale(productId, quantity, req.user);
  }

  @Get('summary')
  @UseGuards(AuthGuard('jwt'))
  async getResumenPorProducto(
    @Req() req,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.salesService.getResumenPorProducto(req.user, from, to);
  }
  
  
}
