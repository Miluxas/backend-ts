import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class State extends BaseModel {
  @Column()
  name: string;

  @Column()
  countryId: number;

  @Column()
  countryName: string;
}

