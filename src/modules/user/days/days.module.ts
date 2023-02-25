import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Days, DaysSchema } from 'src/modules/schemas/days.schema';
import { UserModule } from '../user.module';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Days.name, schema: DaysSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [DaysService],
  controllers: [DaysController],
})
export class DaysModule {}
