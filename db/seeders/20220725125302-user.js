'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          login: 'sergeyserzhan',
          password: '12345678qwe',
          age: 25,
          isDeleted: false,
        },
        {
          id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
          login: 'ivanivanov',
          password: '12345678qwe',
          age: 22,
          isDeleted: false,
        },
        {
          id: '109156be-c4fb-41ea-b1b4-efe1671c5836',
          login: 'vasiliyvasilev',
          password: '12345678qwe',
          age: 22,
          isDeleted: false,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
