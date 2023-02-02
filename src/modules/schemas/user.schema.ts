import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ExcerciseWeek } from './excerciseWeek.schema';

@Schema()
export class User extends Document {
  @Prop({ unique: true, length: 11 })
  id: string;
  @Prop({ required: true, unique: true, index: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExcerciseWeek' }],
  })
  excerciseWeek: ExcerciseWeek[];
}
export const UserSchema = SchemaFactory.createForClass(User);
