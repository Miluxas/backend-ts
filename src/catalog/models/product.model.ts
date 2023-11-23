import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Brand } from './brand.model';
import { Category } from './category.model';
import { VariableType, VariableValue } from './variable-type.model';
import { IMedia } from '../interfaces/media.interface';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false, timestamps: true })
export class Product {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  brand: Brand;

  @Prop()
  categories: Category[];

  @Prop()
  images: IMedia[];

  @Prop()
  attributes: { name: string; value: string }[];

  @Prop()
  skus: Sku[];

  createdAt: Date;
  updatedAt: Date;
}

export class Sku {
  _id: Types.ObjectId;

  name: string;

  images: IMedia[];

  variants: { title: string; type: VariableType; value: VariableValue }[];

  price: number;

  quantity: number;

  createdAt: Date;
  updatedAt: Date;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
