import { Exclude } from "class-transformer";

export class UserEntity {
  id: string;
  login: string;

  @Exclude()
  password: string;

  age: number;

  @Exclude()
  isDeleted: boolean;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
