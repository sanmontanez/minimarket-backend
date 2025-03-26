import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Between } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async createSale(
    productId: number,
    quantity: number,
    user: User
  ): Promise<Sale> {
    const product = await this.productRepo.findOne({
      where: { id: productId, user: { id: user.id } },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado o no pertenece a la tienda');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Stock insuficiente');
    }

    product.stock -= quantity;
    await this.productRepo.save(product);

    const sale = this.saleRepo.create({
      quantity,
      product,
      user,
    });

    return this.saleRepo.save(sale);
  }

  async getSalesByUser(user: User, from?: string, to?: string) {
    const where: any = { user: { id: user.id } };
  
    if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to));
    }
  
    const sales = await this.saleRepo.find({
      where,
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  
    const total = sales.reduce((sum, sale) => {
        const price = sale.product.price;
      return sum + price * sale.quantity;
    }, 0);
  
    return {
      total,
      ventas: sales,
    };
  }

  async getResumenPorProducto(user: User, from?: string, to?: string) {
    const where: any = { user: { id: user.id } };
  
    if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to));
    }
  
    const sales = await this.saleRepo.find({
      where,
      relations: ['product'],
    });
  
    // Agrupar por producto
    const resumen: {
      [key: string]: { totalVendidas: number; ingresos: number };
    } = {};
  
    for (const sale of sales) {
      const nombre = sale.product.name;
      const precio = sale.product.price;
  
      if (!resumen[nombre]) {
        resumen[nombre] = { totalVendidas: 0, ingresos: 0 };
      }
  
      resumen[nombre].totalVendidas += sale.quantity;
      resumen[nombre].ingresos += sale.quantity * precio;
    }
  
    // Convertir a array
    return Object.entries(resumen).map(([producto, datos]) => ({
      producto,
      totalVendidas: datos.totalVendidas,
      ingresos: datos.ingresos,
    }));
  }
  
  
  
}
