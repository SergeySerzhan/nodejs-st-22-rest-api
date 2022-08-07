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
import { UserEntity } from '../../users/entities/user.entity';

@Table({ timestamps: false, underscored: true })
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
  users: UserEntity[];
}
