'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('UserGroup', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        },
        onDelete: 'CASCADE'
      },
      groupId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'Groups',
          key: 'id',
          as: 'groupId'
        },
        onDelete: 'CASCADE'
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserGroups');
  },
};
