import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from '#users/controllers/users.controller';
import { User } from '#users/models/user.model';
import { UsersRepository } from '#users/data-access/users.repository';
import { UsersService } from '#users/services/users.service';
import { UserModel } from '#users/test/__mocks__/user-model.service';
import { user } from '#users/test/fixtures/user.fixture';
import { ErrorMsgs } from '#shared/utils/error-msgs';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let usersController: UsersController;
  let userModel;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User),
          useClass: UserModel,
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
    userModel = moduleRef.get(getModelToken(User));
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      userModel.findOne.mockResolvedValue(user);

      const result = await usersController.getUser(user.id);

      expect(result).toEqual(user);
    });

    it(`should throw error with message ${ErrorMsgs.UserNotFound}`, async () => {
      userModel.findOne.mockResolvedValue(null);

      let result;
      try {
        await usersController.getUser(user.id);
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.UserNotFound));
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      userModel.create.mockResolvedValue(user);

      const result = await usersController.createUser({
        ...user,
        password: '12345678qwe',
      });

      expect(result).toEqual(user);
    });
  });
  //
  describe('updateUser', () => {
    it('should update existing user age', async () => {
      userModel.update.mockResolvedValue([undefined, [user]]);

      const result = await usersController.updateUser(user.id, user);

      expect(result).toEqual(user);
    });

    it(`should throw error with message ${ErrorMsgs.UserNotFound}`, async () => {
      userModel.update.mockResolvedValue([undefined, [null]]);

      let result;
      try {
        await usersController.updateUser(user.id, user);
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.UserNotFound));
    });
  });

  describe('getAutoSuggestUsers', () => {
    it(`should get all users with login which contain ${user.login.slice(
      0,
      1,
    )}`, async () => {
      userModel.findAll.mockResolvedValue([user]);

      const result = await usersController.getAutoSuggestUsers(
        user.login.slice(0, 1),
        undefined,
      );
      expect(result).toEqual([user]);
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      userModel.update.mockResolvedValue([1]);

      const result = await usersController.deleteUser(user.id);

      expect(result).toBeUndefined();
    });

    it(`should throw error with message ${ErrorMsgs.UserNotFound}`, async () => {
      userModel.update.mockResolvedValue([0]);

      let result;
      try {
        await usersController.deleteUser(user.id);
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.UserNotFound));
    });
  });
});
