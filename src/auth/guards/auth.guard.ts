import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from '#users/data-access/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req?.headers?.authorization;
    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];

    const authObj = await this.jwtService.verifyAsync(token);

    const { sub: userId } = authObj;
    const user = await this.usersRepository.findOne({ id: userId });
    // Check if user is not delete from database
    if (!user) throw new ForbiddenException();

    req.user = user;

    return true;
  }
}
