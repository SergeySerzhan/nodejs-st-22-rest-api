import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ErrorMsgs } from '../utils/error-msgs';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if ((exception as any)?.name === 'SequelizeUniqueConstraintError')
      super.catch(new BadRequestException(ErrorMsgs.UniqueLogin), host);

    super.catch(exception, host);
  }
}
