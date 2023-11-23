import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ versionKey: false, timestamps: true })
export class Media {
  _id: Types.ObjectId;

  @Prop()
  url: string;

  @Prop()
  originalName: string;
  @Prop()
  obfuscatedName: string;
  @Prop()
  mimeType: string;
  @Prop()
  size: number;
  @Prop()
  creatorId: number;
  @Prop()
  storage: string;
  @Prop()
  type: string;

  createdAt: Date;
  updatedAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);