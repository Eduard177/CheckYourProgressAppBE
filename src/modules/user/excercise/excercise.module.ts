import { forwardRef, Module } from '@nestjs/common';
import { ExcerciseService } from './excercise.service';
import { ExcerciseController } from './excercise.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Excercise,
  ExcerciseSchema,
} from 'src/modules/schemas/excercise.schema';
import { DaysModule } from '../days/days.module';
import { UserModule } from '../user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Excercise.name, schema: ExcerciseSchema },
    ]),
    DaysModule,
    forwardRef(() => UserModule),
  ],
  providers: [ExcerciseService],
  controllers: [ExcerciseController],
})
export class ExcerciseModule {}
