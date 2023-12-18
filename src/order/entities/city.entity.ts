import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class City extends BaseModel {
  @Column()
  name: string;

  @Column()
  countryId: number;

  @Column()
  stateId: number;

  @Column()
  countryName: string;

  @Column()
  stateName: string;
}

