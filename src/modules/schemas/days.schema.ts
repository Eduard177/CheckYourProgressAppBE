import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Excecise } from './excercise.schema';

@Schema()
export class Days extends Document {
  @Prop({ required: true, unique: true, length: 11 })
  id: ObjectId;
  @Prop({ required: true })
  day: string;
  @Prop({ required: true })
  partBody: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Excecise' }],
  })
  excercises: Excecise[];
  @Prop()
  createdAt: Date;
  @Prop()
  updateAt: Date;
}
export const DaysSchema = SchemaFactory.createForClass(Days);
