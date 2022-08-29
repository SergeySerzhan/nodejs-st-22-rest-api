import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from '#users/controllers/users.controller';
import { User } from '#users/models/user.model';
import { UsersRepository } from '#users/data-access/users.repository';
import { UsersService } from '#users/services/users.service';

const moduleMocker = new ModuleMocker(global);

class TestUser {
  id: string;

  login: string;

  age: number;

  constructor(id: string, login: string, age: number) {
    this.id = id;
    this.login = login;
    this.age = age;
  }

  toJSON() {
    return this;
  }
}

const testUser1 = new TestUser('1', 'testuser1', 25);
const testUser2 = new TestUser('2', 'testuser2', 25);
const testCreateUser = new TestUser('3', 'testuser3', 25);
const testUpdateUser = new TestUser('1', 'testuser1', 26);

const users = [testUser1, testUser2];

const testCreateUserDto = {
  login: testCreateUser.login,
  password: '12345678qwe',
  age: testCreateUser.age,
};

const loginSubstring = 'testuser';

enum ErrorsMsg {
  NotFound = 'User with this id not found',
}

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn((options) => {
              const { id } = options.where;
              return Promise.resolve(users.find((user) => user.id === id));
            }),

            create: jest.fn(() => testCreateUser),

            update: jest.fn((updateUserMock, options) => {
              const { id } = options.where;
              const user = users.find((user) => user.id === id);
              let numOfUpdatedUsers = 0;
              if (user) {
                user.age = updateUserMock.age;
                numOfUpdatedUsers = 1;
              }
              return Promise.resolve([numOfUpdatedUsers, [user]]);
            }),

            findAll: jest.fn((options) => {
              const loginSubstring = Object.getOwnPropertyDescriptor(
                options.where.login,
                Symbol.for('iLike'),
              ).value;
              return Promise.resolve(
                users.filter((user) => user.login.includes(loginSubstring)),
              );
            }),
          },
        },
      ],
    })
      .useMocker((token) => {
        const mockerMetadata = moduleMocker.getMetadata(
          token,
        ) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockerMetadata);
        return new Mock();
      })
      .compile();

    usersController = moduleRef.get(UsersController);
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      expect.assertions(1);
      expect(await usersController.getUser('1')).toEqual(testUser1);
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      expect.assertions(1);
      await expect(async () => {
        await usersController.getUser('3');
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      expect.assertions(1);
      expect(await usersController.createUser(testCreateUserDto)).toEqual(
        testCreateUser,
      );
    });
  });

  describe('updateUser', () => {
    it('should update existing user age', async () => {
      expect.assertions(1);
      expect(
        await usersController.updateUser('1', { age: testUpdateUser.age }),
      ).toEqual(testUpdateUser);
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      expect.assertions(1);
      await expect(async () => {
        await usersController.updateUser('3', { age: testUpdateUser.age });
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('getAutoSuggestUsers', () => {
    it(`should get all users with login which contain ${loginSubstring}`, async () => {
      expect.assertions(1);
      expect(
        await usersController.getAutoSuggestUsers(loginSubstring, undefined),
      ).not.toEqual(expect.arrayContaining(users));
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      expect(await usersController.deleteUser('1')).toBeUndefined();
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      await expect(async () => {
        await usersController.deleteUser('3');
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });
});
