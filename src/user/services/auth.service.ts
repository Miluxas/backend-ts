import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { AuthError } from '../errors';
import { ILoggedInInfo, ILogin } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
  ) {}

  public async login(loginInfo: ILogin): Promise<ILoggedInInfo> {
    return this.userRepository
      .findOne({
        where: { email: loginInfo.email },
        select: [
          'firstName',
          'password',
          'active',
          'emailVerified',
          'lastName',
          'id',
          'avatarUrl',
          'email'
        ],
      })
      .then(async (user) => {
        if (!user) {
          throw new Error(AuthError.INVALID_EMAIL);
        }
        if (await compare(loginInfo.password, user.password)) {
          const token = this.generateAccessToken(user);
          const refreshToken = this.generateRefreshToken(user);
          delete user.password;
          return { user, ...token, refreshToken };
        } else {
          throw new Error(AuthError.WRONG_PASSWORD);
        }
      });
  }

  private generateAccessToken(user: User): {
    token: string;
    expiresIn: string;
  } {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    return { token, expiresIn };
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      },
    );
  }

  private async hashPassword(text: string): Promise<string> {
    const SALT_ROUND = 10;
    return hash(text, SALT_ROUND);
  }

  public async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    return this.userRepository
      .findOne({
        where: { id },
        select: ['password', 'id'],
      })
      .then(async (user) => {
        if (!user) {
          throw new Error(AuthError.INVALID_EMAIL);
        }
        if (await compare(oldPassword, user.password)) {
          const newPasswordHash = await this.hashPassword(newPassword);
          return this.userRepository
            .update({ id }, { password: newPasswordHash })
            .then((updateResult) => {
              return updateResult.affected !== 1;
            });
        } else {
          throw new Error(AuthError.WRONG_PASSWORD);
        }
      });
  }

  public validate(email: string) {
    return this.userRepository
    .findOneBy({ email })
  }
}
