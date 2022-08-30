import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

import { GroupsController } from '#groups/controllers/groups.controller';
import { GroupsService } from '#groups/services/groups.service';
import { GroupsRepository } from '#groups/data-access/groups.repository';
import { Group } from '#groups/models/group.model';
import { GroupModel } from '#groups/test/__mocks__/group-model.service';
import { group } from '#groups/test/fixtures/group.fixture';
import { ErrorMsgs } from '#shared/utils/error-msgs';

const moduleMocker = new ModuleMocker(global);

describe('GroupsController', () => {
  let groupsController: GroupsController;
  let groupModel;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        GroupsRepository,
        {
          provide: getModelToken(Group),
          useClass: GroupModel,
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

    groupsController = moduleRef.get(GroupsController);
    groupModel = moduleRef.get(getModelToken(Group));
  });

  describe('getGroup', () => {
    it('should get a group by id', async () => {
      groupModel.findByPk.mockResolvedValue(group);

      const result = await groupsController.getGroup(group.id);

      expect(result).toEqual(group);
    });

    it(`should throw error with message ${ErrorMsgs.GroupNotFound}`, async () => {
      groupModel.findByPk.mockResolvedValue(null);

      let result;
      try {
        await groupsController.getGroup(group.id);
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.GroupNotFound));
    });
  });

  describe('getAllGroups', () => {
    it('should get all groups', async () => {
      groupModel.findAll.mockResolvedValue([group]);

      const result = await groupsController.getAllGroups();

      expect(result).toEqual([group]);
    });
  });

  describe('createGroup', () => {
    it('should create new group', async () => {
      groupModel.create.mockResolvedValue(group);

      const result = await groupsController.createGroup(group);

      expect(result).toEqual(group);
    });
  });

  describe('updateGroup', () => {
    it('should update existing group name', async () => {
      groupModel.update.mockResolvedValue([undefined, [group]]);

      const result = await groupsController.updateGroup(group.id, group);

      expect(result).toEqual(group);
    });

    it(`should throw error with message ${ErrorMsgs.GroupNotFound}`, async () => {
      groupModel.update.mockResolvedValue([undefined, [null]]);

      let result;
      try {
        await groupsController.getGroup(group.id);
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.GroupNotFound));
    });
  });

  describe('deleteGroup', () => {
    it('should delete existing group', async () => {
      groupModel.destroy.mockResolvedValue(1);

      const result = await groupsController.deleteGroup(group.id);

      expect(result).toBeUndefined();
    });

    it(`should throw error with message ${ErrorMsgs.GroupNotFound}`, async () => {
      groupModel.destroy.mockResolvedValue(0);

      let result;
      try {
        await groupsController.deleteGroup(group.id);
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.GroupNotFound));
    });
  });

  describe('addUsersToGroup', () => {
    it('should add users to group', async () => {
      groupModel.findByPk.mockResolvedValue(group);

      const result = await groupsController.addUsersToGroup(group.id, {
        userIds: ['1'],
      });
      expect(result).toEqual(group);
    });

    it(`should throw error with message ${ErrorMsgs.GroupNotFound}`, async () => {
      groupModel.findByPk.mockResolvedValue(null);

      let result;
      try {
        await groupsController.addUsersToGroup(group.id, {
          userIds: ['1'],
        });
      } catch (err) {
        result = err;
      }

      expect(result).toEqual(new NotFoundException(ErrorMsgs.GroupNotFound));
    });
  });
});
