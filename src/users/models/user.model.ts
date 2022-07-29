import { AllowNull, Column, Model, Table, Unique } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ timestamps: false })
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
}
