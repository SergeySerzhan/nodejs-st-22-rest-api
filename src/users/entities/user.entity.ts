import { Exclude } from 'class-transformer';

import { Group } from '../../groups/models/group.model';

export class UserEntity {
  id: string;

  login: string;

  @Exclude()
  password: string;

  age: number;

  @Exclude()
  isDeleted: boolean;

  groups?: Group[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
