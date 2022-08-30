import { Type } from 'class-transformer';

import { UserEntity } from '#users/entities/user.entity';
import { GroupPermissions } from '#groups/utils/group-permissions';

export class GroupEntity {
  id: string;

  name: string;

  permissions: GroupPermissions[];

  @Type(() => UserEntity)
  users?: UserEntity[];

  constructor(partial: Partial<GroupEntity>) {
    Object.assign(this, partial);
  }
}
