'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      permissions: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.ENUM({values: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']}))
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('groups');
  }
};
