import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '#auth/controllers/auth.controller';
import { UsersModule } from '#users/users.module';
import { AuthService } from '#auth/services/auth.service';
import { AuthGuard } from '#auth/guards/auth.guard';
import { PermissionsGuard } from '#auth/guards/permissions.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PermissionsGuard],
  exports: [AuthGuard, PermissionsGuard, JwtModule],
})
export class AuthModule {}
