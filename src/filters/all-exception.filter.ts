import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ErrorMsgs } from '../utils/error-msgs';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if ((exception as any)?.name === 'SequelizeUniqueConstraintError')
      super.catch(new BadRequestException(ErrorMsgs.UniqueLogin), host);

    if ((exception as any)?.name === 'SequelizeForeignKeyConstraintError') {
      // Find userId in error string from sequelize
      // Error string from sequelize looks like this 'Key (user_id)=(0d5fd281-214d-4e36-ac74-af4239120f50) doesn't exist ...'
      const userId = [
        ...((exception as any)?.parent?.detail as string).matchAll(
          /\(([^)]+)\)/g,
        ),
      ][1][1];
      const errorMsg = userId
        ? `User with id ${userId} doesn't exist`
        : ErrorMsgs.UserIdsNotExist;

      super.catch(new NotFoundException(errorMsg), host);
    }

    super.catch(exception, host);
  }
}
