import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ExcerciseWeek } from './excerciseWeek.schema';

@Schema()
export class User extends Document {
  @Prop({ unique: true, length: 11 })
  id: string;
  @Prop()
  name: string;
  @Prop({ required: true, unique: true, index: true })
  email: string;
  @Prop({ required: true, min: 6 })
  password: string;
  @Prop()
  weight: number;
  @Prop({ length: 2 })
  weightMeasure: string;
  @Prop({ default: 0 })
  loginTries: number;
  @Prop({ default: false })
  isBlocked: boolean;
  @Prop()
  photos: [string];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExcerciseWeek' }],
  })
  excerciseWeek: ExcerciseWeek[];
}
export const UserSchema = SchemaFactory.createForClass(User);
