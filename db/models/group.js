'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {}
  Group.init(
    {
      id: DataTypes.UUID,
      name: DataTypes.STRING,
      permissions: {
        type: DataTypes.ARRAY(
          DataTypes.ENUM({
            values: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'],
          }),
        ),
      },
    },
    {
      sequelize,
      modelName: 'Group',
    },
  );
  return Group;
};
