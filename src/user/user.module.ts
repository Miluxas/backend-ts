import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { MediaModule } from '../media/media.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { userErrorMessages, authErrorMessages } from './errors';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  providers: [UserService, AuthService, JwtStrategy],
})
export class UserModule {}
