import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class Area extends BaseModel {
  @Column()
  countryId: number;

  @Column()
  stateId: number;

  @Column()
  cityId: number;

  @Column({ type: 'text' })
  polygon: string;
}
