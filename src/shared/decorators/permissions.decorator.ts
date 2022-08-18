import { GroupPermissions } from '../../groups/utils/group-permissions';
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: GroupPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
