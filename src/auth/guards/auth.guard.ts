import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req?.headers?.authorization;
    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];

    const authObj = await this.jwtService.verifyAsync(token);

    req.user = { id: authObj.sub };

    return true;
  }
}
