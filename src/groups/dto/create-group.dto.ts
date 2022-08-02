import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

import { GroupPermissions } from '../utils/group-permissions';

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(GroupPermissions, { each: true })
  permissions: GroupPermissions[];
}
