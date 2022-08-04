import {
  AllowNull,
  BelongsToMany,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { GroupPermissions } from '../utils/group-permissions';
import { User } from '../../users/models/user.model';
import { UserGroup } from '../../shared/models/usergroup.model';

@Table({ timestamps: false })
export class Group extends Model {
  @Column({ primaryKey: true, defaultValue: DataTypes.UUIDV4 })
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column(
    DataTypes.ARRAY(
      DataTypes.ENUM({
        values: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'],
      }),
    ),
  )
  permissions: GroupPermissions[];

  @BelongsToMany(() => User, () => UserGroup)
  users: User[];
}
