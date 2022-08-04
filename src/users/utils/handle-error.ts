import { BadRequestException, NotFoundException } from '@nestjs/common';

import { UsersErrorMsgs } from './users-error-msgs';

export function handleError(e): void {
  if (e.name === 'SequelizeUniqueConstraintError')
    throw new BadRequestException(UsersErrorMsgs.UniqueLogin);
  if (e.message === 'No user')
    throw new NotFoundException(UsersErrorMsgs.NotFound);
  throw e;
}
