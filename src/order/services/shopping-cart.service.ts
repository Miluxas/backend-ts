import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SkuService } from '../../catalog/services/sku.service';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { IShoppingCartDetail } from '../interfaces';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly shoppingCartRepository: Repository<ShoppingCart>,
    private readonly skuService: SkuService,
  ) {}

  public async getByUserId(userId: number): Promise<IShoppingCartDetail> {
    const foundShoppingCart = await this.shoppingCartRepository.findOneBy({
      userId,
    });
    if (!foundShoppingCart) {
      return { items: [] };
    }
    return this.getDetail(foundShoppingCart);
  }

  private async getDetail(foundShoppingCart: ShoppingCart) {
    const items = await Promise.all(
      foundShoppingCart.items.map(
        async (item) =>
          await this.skuService.getById(item.skuId).then((sku) => ({
            ...sku,
            skuId: sku._id.toString(),
            count: item.count,
          })),
      ),
    );
    return { items };
  }

  public async updateSku(
    userId: number,
    skuId: string,
    count: number,
  ): Promise<IShoppingCartDetail> {
    let foundShoppingCart = await this.shoppingCartRepository.findOneBy({
      userId,
    });
    if (!foundShoppingCart) {
      foundShoppingCart = new ShoppingCart();
      foundShoppingCart.userId = userId;
    }
    if (!foundShoppingCart.items) foundShoppingCart.items = [];
    let item = foundShoppingCart.items.find((it) => it.skuId == skuId);
    if (item) {
      item.count = count;
    } else {
      foundShoppingCart.items.push({ skuId, count });
    }
    foundShoppingCart.items = foundShoppingCart.items.filter(
      (item) => item.count > 0,
    );
    await this.shoppingCartRepository.save(foundShoppingCart);
    return this.getDetail(foundShoppingCart);
  }
}
