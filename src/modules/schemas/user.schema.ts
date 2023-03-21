import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Days } from './days.schema';

@Schema()
export class User extends Document {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop()
  name: string;
  @Prop({ required: true, unique: true, index: true })
  email: string;
  @Prop({ required: true, min: 6 })
  password: string;
  @Prop()
  weight: number;
  @Prop({ length: 2, default: 'lb' })
  weightMeasure: string;
  @Prop({ default: 0 })
  loginTries: number;
  @Prop({ default: false })
  isBlocked: boolean;
  @Prop({ default: false })
  isConfirmedEmail: boolean;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Days.name }],
  })
  days: [Days];
}
export const UserSchema = SchemaFactory.createForClass(User);
