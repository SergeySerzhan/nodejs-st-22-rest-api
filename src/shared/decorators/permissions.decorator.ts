import { SetMetadata } from '@nestjs/common';

import { GroupPermissions } from '#groups/utils/group-permissions';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: GroupPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
