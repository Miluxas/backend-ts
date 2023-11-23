import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model';

@Entity()
export class User extends BaseModel {
  @Column({ length: 80 })
  firstName: string;

  @Column({ length: 80 })
  lastName: string;

  @Column({})
  email: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true, select: false })
  refreshToken?: string;
}
