import {AllowNull, Column, Model, Table, Unique} from "sequelize-typescript";

@Table({timestamps: false})
export class User extends Model {
    @AllowNull(false)
    @Unique
    @Column({primaryKey: true})
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

    @AllowNull(false)
    @Column({defaultValue: false})
    isDeleted: boolean;
}