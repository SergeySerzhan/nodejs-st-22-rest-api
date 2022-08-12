import { IsArray, IsUUID } from 'class-validator';

export class AddUsersToGroupDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}
