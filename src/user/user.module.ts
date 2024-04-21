import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { MediaModule } from '../media/media.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { RefreshToken, User } from './entities';
import { authErrorMessages, userErrorMessages } from './errors';
import { AuthService } from './services/auth.service';
import { RBACService } from './services/rbac.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    ErrorHandlerModule.register({ ...userErrorMessages, ...authErrorMessages }),
    MediaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    RBACService,
  ],
  exports: [RBACService],
})
export class UserModule {}
