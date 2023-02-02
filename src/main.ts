import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('CheckYourProgressApi')
    .setDescription('This is a api of checkYourProgressApp')
    .setVersion('0.0.1')
    .build();
  const documet = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, documet, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  await app.listen(AppModule.port);
}
bootstrap();
