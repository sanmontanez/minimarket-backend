import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  storeName: string;

  @OneToMany(() => Product, product => product.user)
  products: Product[]; // 👈 ESTA LÍNEA es la que faltaba
}
