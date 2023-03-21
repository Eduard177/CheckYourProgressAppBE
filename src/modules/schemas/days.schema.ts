import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Excercise } from './excercise.schema';
import { User } from './user.schema';

@Schema()
export class Days extends Document {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop({ required: true })
  day: string;
  @Prop({ required: true })
  bodyParts: [];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Excecise' }],
  })
  exercises: [Excercise];
  @Prop({ default: Date.now() })
  createdAt: Date;
  @Prop({ default: Date.now() })
  updateAt: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  user: User;
}
export const DaysSchema = SchemaFactory.createForClass(Days);
