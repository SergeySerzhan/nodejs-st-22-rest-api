import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { globalLogger } from './shared/middlewares/logger.middleware';
import { logger } from './shared/loggers/service.logger';

process.on('uncaughtException', (e) => {
  logger.log({level: 'error', message: e.message, error: e});
  process.exit();
});

process.on('unhandledRejection', (e) => {
  logger.log({level: 'error', message: 'Something went wrong: unhandledRejection', error: e});
  process.exit();
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.use(globalLogger);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
