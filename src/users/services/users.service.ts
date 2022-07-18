import { Injectable, NotFoundException } from "@nestjs/common";
import { v4 } from 'uuid';

import { User } from "../interfaces/user.interface";
import { CreateUserDto } from "../dto/create-user-dto";
import { UpdateUserDto } from "../dto/update-user-dto";

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findOne(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id);
    if (!user) throw new NotFoundException('User with this id not found');
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {...createUserDto, id: v4(), isDeleted: false};
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const userIndex = this.users.findIndex(user => user.id === id);
    const updatedUser = {...user, ...updateUserDto};
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }
}
