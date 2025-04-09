import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  available: boolean;

  @Prop({ required: true })
  @Prop({default: "Other"})
  category: string;

  @Prop({ default: 10 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);