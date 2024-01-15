import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';
import { CurrencyColumn } from '../../common/currency-column.decorator';
import { IPaypalResponse } from '../interfaces';

@Entity()
export class Payment extends BaseModel {
  @Column()
  orderId: number;

  @Column()
  referenceId: string;

  @Column()
  intent: string;

  @Column()
  status: string;

  @Column()
  paymentId: string;

  @Column()
  currencyCode: string;

  @CurrencyColumn()
  value: number;

  @Column({ type: 'json' })
  responses: IPaypalResponse[];
}
