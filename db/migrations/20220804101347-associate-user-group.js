'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('user_groups', {
      user_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      group_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'groups',
          key: 'id',
          as: 'groupId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('user_groups');
  },
};
