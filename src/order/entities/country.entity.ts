import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class Country extends BaseModel {
  @Column()
  name: string;

  @Column()
  flag: string;
}

