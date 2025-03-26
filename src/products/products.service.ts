import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(productData: { name: string; price: number; stock: number }, user: User) {
    const product = this.productRepo.create({ ...productData, user });
    return this.productRepo.save(product);
  }

  async findAllByUser(user: User) {
    return this.productRepo.find({ where: { user } });
  }

  async updateProduct(
    id: number,
    updateData: { name?: string; price?: number; stock?: number },
    user: User
  ) {
    const product = await this.productRepo.findOne({
        where: { id, user: { id: user.id } },
        relations: ['user'],
      });
  
    if (!product) {
      throw new Error('Producto no encontrado o no autorizado');
    }
  
    Object.assign(product, updateData);
    return this.productRepo.save(product);
  }
  
  async deleteProduct(id: number, user: User) {
    const product = await this.productRepo.findOne({
        where: { id, user: { id: user.id } },
        relations: ['user'],
      });
  
    if (!product) {
      throw new Error('Producto no encontrado o no autorizado');
    }
  
    return this.productRepo.remove(product);
  }
  
  
  
}
