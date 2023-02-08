import { Module } from '@nestjs/common';
import { MailManagerService } from './mail-manager.service';
import { MailManagerController } from './mail-manager.controller';
import { AuthModule } from '../auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/schemas/user.schema';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
  ],
  providers: [MailManagerService],
  controllers: [MailManagerController],
})
export class MailManagerModule {}
