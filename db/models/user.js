'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Group, {
        through: 'user_groups',
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      id: DataTypes.UUID,
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      age: DataTypes.INTEGER,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
    },
  );

  return User;
};
