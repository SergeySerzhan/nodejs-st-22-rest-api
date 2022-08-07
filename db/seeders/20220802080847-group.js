'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
        'Groups',
        [
          {
            id: '7431a0b8-359e-4c00-873f-98ea20dea47e',
            name: 'admin',
            permissions: Sequelize.literal(`ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']::"enum_Groups_permissions"[]`)
          },
        ],
        {},
    );
  },

  async down (queryInterface) {
    return queryInterface.bulkDelete('Groups', null, {});
  }
};
