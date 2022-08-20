import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { User } from './models/user.model';
import { UsersRepository } from './data-access/users.repository';
import { UsersService } from './services/users.service';

const moduleMocker = new ModuleMocker(global);

class UserMock {
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

const testUser1 = new UserMock('1', 'testuser1', 25);
const testUser2 = new UserMock('2', 'testuser2', 25);
const createUser = new UserMock('3', 'testuser3', 25);
const updateUser = new UserMock('1', 'testuser1', 26);

const users = [testUser1, testUser2];

const createUserMock = {
  login: createUser.login,
  password: '12345678qwe',
  age: createUser.age,
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

            create: jest.fn(() => createUser),

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
      expect(await usersController.getUser('1')).toEqual(testUser1);
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      await expect(async () => {
        await usersController.getUser('3');
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      expect(await usersController.createUser(createUserMock)).toEqual(
        createUser,
      );
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      expect(
        await usersController.updateUser('1', { age: updateUser.age }),
      ).toEqual(updateUser);
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      await expect(async () => {
        await usersController.updateUser('3', { age: updateUser.age });
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('getAutoSuggestUsers', () => {
    it(`should get all users with login which contain ${loginSubstring}`, async () => {
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
