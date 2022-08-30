import { GroupPermissions } from '#groups/utils/group-permissions';

export const group = {
  id: '7431a0b8-359e-4c00-873f-98ea20dea47e',

  name: 'group',

  permissions: [GroupPermissions.read, GroupPermissions.write],

  toJSON: function () {
    return this;
  },
};
