import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { GroupPermissions } from '../utils/group-permissions';

export class UpdateGroupDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsEnum(GroupPermissions, {
    each: true,
    message: `Permissions must contain only allowed values: ${GroupPermissions.read}, ${GroupPermissions.delete}, ${GroupPermissions.share}, ${GroupPermissions.upload}, ${GroupPermissions.write}`,
  })
  permissions: GroupPermissions[];
}
