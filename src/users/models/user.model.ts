import {
  AllowNull,
  BelongsToMany,
  Column,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Group } from '../../groups/models/group.model';
import { UserGroup } from '../../shared/models/usergroup.model';

@Table({ timestamps: false, underscored: true })
export class User extends Model {
  @Column({ primaryKey: true, defaultValue: DataTypes.UUIDV4 })
  id: string;

  @AllowNull(false)
  @Unique
  @Column
  login: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  age: number;

  @Column({ defaultValue: false })
  isDeleted: boolean;

  @BelongsToMany(() => Group, () => UserGroup)
  groups: Group[];
}
