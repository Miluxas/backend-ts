import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class Address extends BaseModel {
  @Column()
  areaId: number;

  @Column()
  userId: number;

  @Column()
  countryId: number;

  @Column()
  stateId: number;

  @Column()
  cityId: number;

  @Column()
  countryName: string;

  @Column()
  stateName: string;

  @Column()
  cityName: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  detail: string;

  @Column()
  postalCode: string;


}

