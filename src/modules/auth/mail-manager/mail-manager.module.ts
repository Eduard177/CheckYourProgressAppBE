import { Module } from '@nestjs/common';
import { MailManagerService } from './mail-manager.service';
import { MailManagerController } from './mail-manager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/schemas/user.schema';
import { ConfigModule } from 'src/config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [MailManagerService],
  controllers: [MailManagerController],
})
export class MailManagerModule {}
