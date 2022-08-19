import { NotFoundException } from '@nestjs/common';

import { UserEntity } from '../users/entities/user.entity';
import { GroupEntity } from '../groups/entities/group.entity';

interface options {
  entityName: string;
}

export function checkData(
  data: UserEntity | GroupEntity | number,
  options: options,
): void {
  if (!data)
    throw new NotFoundException(
      `${
        options.entityName[0].toUpperCase() + options.entityName.slice(1)
      } with this id not found`,
    );
}
