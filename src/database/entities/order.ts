import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from './user';
import { CartEntity } from './cart';
import { StatusType } from 'src/shared';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  cartId: string;

  @Column({ type: 'jsonb' })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column({ type: 'jsonb' })
  delivery: {
    type: string;
    address: any;
  };

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'enum', enum: StatusType })
  status: StatusType;

  @Column({ type: 'integer', nullable: false })
  total: number;

  @OneToOne(() => CartEntity)
  cart: CartEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
