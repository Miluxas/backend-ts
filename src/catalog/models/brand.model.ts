import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ versionKey: false, timestamps: true })
export class Brand {
  _id: Types.ObjectId;

  @Prop()
  title: string;

  createdAt: Date;
  updatedAt: Date;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
