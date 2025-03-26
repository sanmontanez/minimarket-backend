import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

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

  async getSalesByUser(user: User) {
    return this.saleRepo.find({
      where: { user: { id: user.id } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }
}
