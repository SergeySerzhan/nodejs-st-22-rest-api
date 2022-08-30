import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { GroupPermissions } from '#groups/utils/group-permissions';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(GroupPermissions, {
    each: true,
    message: `Permissions must contain only allowed values: ${Object.values(
      GroupPermissions,
    ).join(', ')}`,
  })
  permissions: GroupPermissions[];
}
