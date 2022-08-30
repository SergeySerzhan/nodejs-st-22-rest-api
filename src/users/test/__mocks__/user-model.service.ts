import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModel {
  findOne = jest.fn();

  findAll = jest.fn();

  create = jest.fn();

  update = jest.fn();
}
