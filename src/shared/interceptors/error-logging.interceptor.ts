import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { logger } from '../loggers/default.logger';

export class ErrorLoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const req = ctx.switchToHttp().getRequest();
        const params = req?.params || {};
        const query = req?.query || {};
        const body = req?.body || {};
        const args = { ...params, ...query, body };

        logger.log({
          level: 'error',
          message: err.message || 'Internal server error',
          class: ctx.getClass().name,
          method: ctx.getHandler().name,
          arguments: args,
          error: err,
        });

        throw err;
      }),
    );
  }
}
