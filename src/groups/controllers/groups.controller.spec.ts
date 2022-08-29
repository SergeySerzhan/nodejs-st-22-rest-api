import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';

import { GroupsController } from '#groups/controllers/groups.controller';
import { GroupsService } from '#groups/services/groups.service';
import { GroupsRepository } from '#groups/data-access/groups.repository';
import { Group } from '#groups/models/group.model';
import { GroupPermissions } from '#groups/utils/group-permissions';

const moduleMocker = new ModuleMocker(global);

class TestGroup {
  id: string;

  name: string;

  permissions: GroupPermissions[];

  constructor(id: string, name: string, ...permissions: GroupPermissions[]) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
  }

  toJSON() {
    return this;
  }
}

const testGroup1 = new TestGroup(
  '1',
  'testgroup1',
  GroupPermissions.delete,
  GroupPermissions.read,
);
const testGroup2 = new TestGroup(
  '2',
  'testgroup2',
  GroupPermissions.delete,
  GroupPermissions.read,
);
const testCreateGroup = new TestGroup('3', 'testgroup3', GroupPermissions.read);
const testUpdateGroup = new TestGroup(
  '1',
  'testgroup10',
  GroupPermissions.delete,
  GroupPermissions.read,
);

const testCreateGroupDto = {
  name: 'testgroup3',
  permissions: [GroupPermissions.read],
};

const groups = [testGroup1, testGroup2];

enum ErrorsMsg {
  NotFound = 'Group with this id not found',
}

describe('GroupsController', () => {
  let groupsController: GroupsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        GroupsRepository,
        {
          provide: getModelToken(Group),
          useValue: {
            findByPk: jest.fn((id) => {
              return Promise.resolve(groups.find((group) => group.id === id));
            }),

            findAll: jest.fn().mockResolvedValue(groups),

            create: jest.fn().mockResolvedValue(testCreateGroup),

            update: jest.fn((updateGroupMock, options) => {
              const { id } = options.where;
              const group = groups.find((group) => group.id === id);
              let numOfUpdatedGroups = 0;
              if (group) {
                group.name = updateGroupMock.name;
                numOfUpdatedGroups = 1;
              }
              return Promise.resolve([numOfUpdatedGroups, [group]]);
            }),

            destroy: jest.fn((options) => {
              const { id } = options.where;
              const group = groups.find((group) => group.id === id);
              return Promise.resolve(group ? 1 : 0);
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

    groupsController = moduleRef.get(GroupsController);
  });

  describe('getGroup', () => {
    it('should get a group by id', async () => {
      expect.assertions(1);
      expect(await groupsController.getGroup('1')).toEqual(testGroup1);
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      expect.assertions(1);
      await expect(async () => {
        await groupsController.getGroup('3');
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('getAllGroups', () => {
    it('should get all groups', async () => {
      expect.assertions(1);
      expect(await groupsController.getAllGroups()).toEqual(groups);
    });
  });

  describe('createGroup', () => {
    it('should create new group', async () => {
      expect.assertions(1);
      expect(await groupsController.createGroup(testCreateGroupDto)).toEqual(
        testCreateGroup,
      );
    });
  });

  describe('updateGroup', () => {
    it('should update existing group name', async () => {
      expect.assertions(1);
      expect(
        await groupsController.updateGroup('1', { name: testUpdateGroup.name }),
      ).toEqual(testUpdateGroup);
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      expect.assertions(1);
      await expect(async () => {
        await groupsController.updateGroup('3', { name: testUpdateGroup.name });
      }).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('deleteGroup', () => {
    it('should delete existing group', async () => {
      expect.assertions(1);
      expect(await groupsController.deleteGroup('1')).toBeUndefined();
    });

    it(`should throw error with message ${ErrorsMsg.NotFound}`, async () => {
      expect.assertions(1);
      await expect(
        async () => await groupsController.deleteGroup('3'),
      ).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });

  describe('addUsersToGroup', () => {
    it('should add users to group', async () => {
      expect.assertions(1);
      expect(
        await groupsController.addUsersToGroup('1', { userIds: ['1'] }),
      ).toEqual(testGroup1);
    });

    it(`should throw error with message ${ErrorsMsg}`, async () => {
      expect.assertions(1);
      await expect(
        async () =>
          await groupsController.addUsersToGroup('3', { userIds: ['1'] }),
      ).rejects.toThrow(new NotFoundException(ErrorsMsg.NotFound));
    });
  });
});
