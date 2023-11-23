import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VariableTypeDocument = HydratedDocument<VariableType>;

@Schema({ versionKey: false, timestamps: true })
export class VariableType {
  _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  values: VariableValue[];

  createdAt: Date;
  updatedAt: Date;
}

export class VariableValue {
  name: string;
  value: string;
}

export const VariableTypeSchema = SchemaFactory.createForClass(VariableType);
