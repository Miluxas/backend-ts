import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class ShoppingCart extends BaseModel {
  @Column({ type: 'json' })
  items: ShoppingCartItem[];

  @Column()
  userId: number;
}

export class ShoppingCartItem {
  skuId: string; 
  count: number 
}
