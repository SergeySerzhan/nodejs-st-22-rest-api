import { AllowNull, Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ timestamps: false })
export class Group extends Model {
    @Column({ primaryKey: true, defaultValue: DataTypes.UUIDV4 })
    id: string;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column
    permissions: string[];
}