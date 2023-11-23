import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class Order extends BaseModel {
  @Column({ type: 'json' })
  items: OrderItem[];

  @Column()
  areaId: number;
}

export class OrderItem {
  sku: OrderSku; 
  count: number 
}

export class OrderSku {
  _id: string;

  name: string;

  images: any[];

  variants: any[];

  price: number;
}
