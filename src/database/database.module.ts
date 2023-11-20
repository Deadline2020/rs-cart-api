import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CartEntity,
  CartItemEntity,
  OrderEntity,
  UserEntity,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [CartEntity, CartItemEntity, UserEntity, OrderEntity],
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      UserEntity,
      OrderEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
