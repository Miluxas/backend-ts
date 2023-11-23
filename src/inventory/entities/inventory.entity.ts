import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseModel } from './base-model';
import { Warehouse } from './warehouse.entity';

@Entity()
export class Inventory extends BaseModel {
  @Column({})
  @Index()
  skuId: string;

  @Column({ default: 'Available' })
  @Index()
  status: InventoryStatus;

  @Column({})
  @Index()
  warehouseId: number;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;

  @Column({nullable:true})
  @Index()
  parcelId?: number;
}

export type InventoryStatus = 'Available' | 'Reserved' | 'Sold';
