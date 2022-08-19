'use strict';
const { hash } = require('bcrypt');

const hashPassword = await hash('12345678qwe', 12);

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          login: 'sergeyserzhan',
          password: hashPassword,
          age: 25,
        },
        {
          id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
          login: 'ivanivanov',
          password: hashPassword,
          age: 22,
        },
        {
          id: '109156be-c4fb-41ea-b1b4-efe1671c5836',
          login: 'vasiliyvasilev',
          password: hashPassword,
          age: 22,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
