import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginDto } from '#auth/dto/login.dto';
import { AuthService } from '#auth/services/auth.service';
import { ErrorMsgs } from '#shared/utils/error-msgs';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);

    if (!token) throw new UnauthorizedException(ErrorMsgs.UserLoginError);

    return { token };
  }
}
