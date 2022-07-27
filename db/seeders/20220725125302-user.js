'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          login: 'sergeyserzhan',
          password: '12345678qwe',
          age: 25,
        },
        {
          login: 'ivanivanov',
          password: '12345678qwe',
          age: 22,
        },
        {
          login: 'vasiliyvasilev',
          password: '12345678qwe',
          age: 22,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
