import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { ConfigKeys } from 'src/config/keys/config.keys';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get(ConfigKeys.DATABASE_URL),
    }),
  }),
];
