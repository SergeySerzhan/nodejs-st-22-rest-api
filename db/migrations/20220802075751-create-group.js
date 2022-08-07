'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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
    await queryInterface.dropTable('Groups');
  }
};