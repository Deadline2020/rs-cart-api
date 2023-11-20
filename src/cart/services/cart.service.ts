import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart, CartItem } from '../models';
import { CartEntity, CartItemEntity } from 'src/database/entities';
import { StatusType } from 'src/shared';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId, status: StatusType.OPEN },
      relations: ['items'],
    });

    if (!cart) {
      return null;
    }

    const cartItems: CartItem[] = cart.items?.map((item) => ({
      product: {
        id: item.productId,
        title: 'Product title',
        description: 'Product description',
        price: 10,
      },
      count: item.count,
    }));

    return {
      id: cart.id,
      items: cartItems || [],
    };
  }

  async createByUserId(userId: string): Promise<Cart> {
    const currentDate = new Date();

    const newCart: CartEntity = this.cartRepository.create({
      userId,
      status: StatusType.OPEN,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    await this.cartRepository.save(newCart);

    return { id: newCart.id, items: [] };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart: Cart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }
    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const updatingCart: CartEntity = await this.cartRepository.findOne({
      where: { userId, status: StatusType.OPEN },
    });

    await this.cartItemRepository.delete({
      cartId: updatingCart.id,
    });

    for (const { product, count } of items) {
      const newCartItem: CartItemEntity = this.cartItemRepository.create({
        productId: product.id,
        count,
        cartId: updatingCart.id,
      });

      await this.cartItemRepository.save(newCartItem);
    }

    const updatedCart = this.cartRepository.merge(updatingCart, {
      updatedAt: new Date(),
    });

    await this.cartRepository.save(updatedCart);

    return this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
    });

    await this.cartRepository.remove(cart);
  }
}
