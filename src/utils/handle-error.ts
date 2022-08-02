import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ErrorMsgs } from './error-msgs';

export function handleError(e): void {
  if (e.name === 'SequelizeUniqueConstraintError')
    throw new BadRequestException(ErrorMsgs.UniqueLogin);
  if (e.message === 'No user')
    throw new NotFoundException(ErrorMsgs.UserNotFound);
  if (e.message === 'No group')
    throw new NotFoundException(ErrorMsgs.GroupNotFound)
  throw e;
}
