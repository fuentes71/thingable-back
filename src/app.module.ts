import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CronJobModule } from './app/cron-job/cron-job.module';
import { EventsModule } from './app/events/events.module';
import { MachinesModule } from './app/machines/machines.module';
import { PrismaModule } from './prisma/prisma.module';

import { CustomExceptionFilter } from './shared/filters';
import { CustomResponseInterceptor } from './shared/interceptors';
import { ApiKeyMiddleware } from './shared/middleware';
import { ClassValidatorPipe } from './shared/pipes';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MachinesModule,
    EventsModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ClassValidatorPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
