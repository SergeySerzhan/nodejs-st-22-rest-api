import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupModel {
  findByPk = jest.fn();

  findAll = jest.fn();

  create = jest.fn();

  update = jest.fn();

  destroy = jest.fn();
}
