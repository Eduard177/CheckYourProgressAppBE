import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Excecise extends Document {
  @Prop({ required: true })
  exercise: string;
  @Prop({ required: true })
  sets: number;
  @Prop({ required: true })
  repetition: number;
  @Prop({ required: true })
  weight: number;
  @Prop()
  weightMeasure: string;
}
export const ExceciseSchema = SchemaFactory.createForClass(Excecise);
