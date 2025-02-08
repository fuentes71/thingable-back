import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { Partitioners } from 'kafkajs';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('control-service/api', { exclude: ['/'] });
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Documentação da API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'apiKey')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.security = [{ apiKey: [] }];

  SwaggerModule.setup('control-service/api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_URL],
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_ID,
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
