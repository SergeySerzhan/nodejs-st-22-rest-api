'use strict';

module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert(
        'Groups',
        [
          {
            id: '7431a0b8-359e-4c00-873f-98ea20dea47e',
            name: 'admin',
            permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
          },
        ],
        {},
    );
  },

  async down (queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
