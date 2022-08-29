import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionFilter } from '#shared/filters/all-exception.filter';
import { globalLogger } from '#shared/middlewares/logger.middleware';
import { logger } from '#shared/loggers/default.logger';
import { ErrorLoggingInterceptor } from '#shared/interceptors/error-logging.interceptor';

process.on('uncaughtException', (e) => {
  logger.log({ level: 'error', message: e.message, error: e });
  process.exit();
});

process.on('unhandledRejection', (e) => {
  logger.log({
    level: 'error',
    message: 'Something went wrong: unhandledRejection',
    error: e,
  });
  process.exit();
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
  });

  const { default: helmet } = await import('helmet');

  app.use(helmet());

  app.enableVersioning();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.use(globalLogger);

  app.useGlobalInterceptors(new ErrorLoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Users and groups API')
    .setDescription('CRUD API to manage users and groups')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
