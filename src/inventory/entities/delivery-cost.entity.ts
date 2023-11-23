import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from './base-model';
import { CurrencyColumn } from '../../common/currency-column.decorator';

@Entity()
export class DeliveryCost extends BaseModel {
  @Column({ default: 'Available' })
  @Index()
  status: string;

  @Column({})
  @Index()
  warehouseId: number;

  @Column({})
  @Index()
  areaId: number;

  @CurrencyColumn()
  cost: number;

}
