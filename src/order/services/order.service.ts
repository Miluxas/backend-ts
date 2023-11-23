import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SkuService } from '../../catalog/services/sku.service';
import { ParcelService } from '../../inventory/services/parcel.service';
import { Order } from '../entities/order.entity';
import { IRegisterOrder } from '../interfaces';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly skuService: SkuService,
    private readonly parcelService: ParcelService,
  ) {}

  public async register(newOrder: IRegisterOrder): Promise<Order> {
    const order = new Order();
    order.areaId = 1;
    order.items = await Promise.all(
      newOrder.items.map(async (item) => ({
        sku: await this.skuService
          .getById(item.sku)
          .then((sku) => ({ ...sku, _id: sku._id.toString() })),
        count: item.count,
      })),
    );
    return this.orderRepository.save(order).then((order) => {
      order.items.forEach(async (item) => {
        await this.skuService.updateQuantity(item.sku._id, -item.count);
      });
      return order;
    });
  }

  public async getParcelsInfo(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    return this.parcelService.info({
      areaId: order.areaId,
      items: order.items.map((item) => ({
        sku: item.sku._id,
        count: item.count,
      })),
    });
  }

  public async registerParcels(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    return this.parcelService.register({
      areaId: order.areaId,
      orderId: order.id,
      items: order.items.map((item) => ({
        sku: item.sku._id,
        count: item.count,
      })),
    });
  }

  public async checkoutOrder(id: number) {
    return this.parcelService.checkoutOrder(id);
  }
}
