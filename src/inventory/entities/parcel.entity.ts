import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class Parcel extends BaseModel {
  @Column({ type: 'json' })
  items: ParcelItem[];

  @Column()
  warehouseId: number;

  @Column({nullable:true})
  orderId?: number;
}

export class ParcelItem {
  sku: string; 
  count: number 
}
