import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Days } from './days.schema';

@Schema()
export class ExcerciseWeek extends Document {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Days' }],
  })
  days: Days[];
}

export const ExcerciseWeekSchema = SchemaFactory.createForClass(ExcerciseWeek);
