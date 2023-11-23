import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class Warehouse extends BaseModel {
  @Column({})
  @Index({fulltext:true})
  name: string;

  @Column({ default: 'Available' })
  @Index()
  status: string;
}
