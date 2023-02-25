import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Days } from './days.schema';

@Schema()
export class Exercises extends Document {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop({ required: true })
  exercise: string;
  @Prop({ required: true })
  sets: number;
  @Prop({ required: true })
  repetition: number;
  @Prop({ required: true })
  weight: number;
  @Prop({ length: 2, default: 'lb' })
  weightMeasure: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Days.name })
  @Type(() => Days)
  day: Days;
}
export const ExercisesSchema = SchemaFactory.createForClass(Exercises);
