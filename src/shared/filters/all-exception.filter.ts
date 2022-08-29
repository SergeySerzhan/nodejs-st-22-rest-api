import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ErrorMsgs } from '#shared/utils/error-msgs';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    switch ((exception as any)?.name) {
      case 'SequelizeUniqueConstraintError':
        super.catch(new BadRequestException(ErrorMsgs.UniqueLogin), host);
        break;
      case 'SequelizeForeignKeyConstraintError':
        super.catch(new NotFoundException(ErrorMsgs.UserIdsNotExist), host);
        break;
      case 'TokenExpiredError':
        super.catch(new UnauthorizedException(), host);
        break;
      case 'JsonWebTokenError':
        super.catch(new ForbiddenException(), host);
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}
