import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { GroupPermissions } from '../utils/group-permissions';

export class UpdateGroupDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsEnum(GroupPermissions, { each: true })
  permissions: GroupPermissions[];
}
