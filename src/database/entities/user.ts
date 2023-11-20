import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { CartEntity } from './cart';
import { OrderEntity } from './order';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  carts: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  orders: OrderEntity[];
}
