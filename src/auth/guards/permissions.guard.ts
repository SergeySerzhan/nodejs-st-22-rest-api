import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '#shared/decorators/permissions.decorator';
import { GroupPermissions } from '#groups/utils/group-permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<GroupPermissions[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    // Check if doesn't need any permission
    if (!requiredPermissions?.length) return true;

    const req = context.switchToHttp().getRequest();

    // Check if user, which perform some action, own performed entity
    if (req?.params?.id && req?.user?.id && req.params.id === req.user.id)
      return true;

    // Check if user have some groups
    if (!req?.user?.groups) throw new ForbiddenException();

    // Check if user contains one of required permissions
    for (let i = 0; i < req.user.groups.length; i++) {
      if (
        req.user.groups[i].permissions.some((permission) =>
          requiredPermissions.includes(permission),
        )
      )
        return true;
    }

    throw new ForbiddenException();
  }
}
