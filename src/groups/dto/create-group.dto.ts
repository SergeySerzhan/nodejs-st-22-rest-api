import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { GroupPermissions } from '../utils/group-permissions';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(GroupPermissions, {
    each: true,
    message: `Permissions must contain only allowed values: ${GroupPermissions.read}, ${GroupPermissions.delete}, ${GroupPermissions.share}, ${GroupPermissions.upload}, ${GroupPermissions.write}`,
  })
  permissions: GroupPermissions[];
}
