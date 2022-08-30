import { NotFoundException } from '@nestjs/common';

import { UserEntity } from '#users/entities/user.entity';
import { GroupEntity } from '#groups/entities/group.entity';
import { CheckDataOptions } from '#shared/utils/types';

export function checkData(
  data: UserEntity | GroupEntity | number,
  options: CheckDataOptions,
): void {
  if (!data) throw new NotFoundException(options.errMsg);
}
