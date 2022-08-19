import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './services/auth.service';
import { ErrorMsgs } from '../utils/error-msgs';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);

    if (!token) throw new UnauthorizedException(ErrorMsgs.UserLoginError);

    return { token };
  }
}
