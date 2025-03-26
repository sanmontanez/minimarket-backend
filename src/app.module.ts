import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { SalesModule } from './sales/sales.module';
import { Sale } from './sales/sale.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'minimarket',
      entities: [User, Product, Sale],
      synchronize: true, // solo para desarrollo
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    SalesModule,
  ],
})
export class AppModule {}
