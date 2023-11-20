import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { Order } from '../models';
import { CartEntity, OrderEntity } from 'src/database/entities';
import { StatusType } from 'src/shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async findById(orderId: string): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'cart'],
    });
  }

  async create(data: any): Promise<Order> {
    const order = this.orderRepository.create({
      userId: data.userId,
      cartId: data.cartId,
      payment: data.payment,
      delivery: data.delivery,
      comments: data.comments,
      status: StatusType.IN_PROGRESS,
      total: data.total,
    });

    const cart = await this.cartRepository.findOne({
      where: { id: data.cartId },
    });

    const updatedCart = this.cartRepository.merge(cart, {
      status: StatusType.ORDERED,
      updatedAt: new Date(),
    });

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(updatedCart);
      await transactionalEntityManager.save(order);
    });

    return order;
  }
}
