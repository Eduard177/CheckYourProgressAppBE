import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Excecise extends Document {
  @Prop({ required: true, unique: true, length: 11 })
  id: ObjectId;
  @Prop({ required: true })
  exercise: string;
  @Prop({ required: true })
  sets: number;
  @Prop({ required: true })
  repetition: object;
  @Prop({ required: true })
  weight: object;
}
export const ExceciseSchema = SchemaFactory.createForClass(Excecise);
