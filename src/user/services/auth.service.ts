import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { RefreshToken, User } from '../entities';
import { AuthError } from '../errors';
import { ILoggedInInfo, ILogin } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
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
          'email',
        ],
      })
      .then(async (user) => {
        if (!user) {
          throw new Error(AuthError.INVALID_EMAIL);
        }
        if (await compare(loginInfo.password, user.password)) {
          const refreshTokenObject = this.generateRefreshToken(user);
          await this.updateRefreshToken(
            user.id,
            refreshTokenObject.refreshToken,
            refreshTokenObject.expiresAt,
            refreshTokenObject.uid,
          );
          const token = this.generateAccessToken(user, refreshTokenObject.uid);
          delete user.password;
          return {
            user,
            ...token,
            refreshToken: refreshTokenObject.refreshToken,
          };
        } else {
          throw new Error(AuthError.WRONG_PASSWORD);
        }
      });
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
    uid: string,
  ) {
    const hashedRefreshToken =await hash(refreshToken, 10);
    let token = await this.refreshTokenRepository.findOneBy({ userId, uid });
    if (!token) {
      token = new RefreshToken();
      token.userId = userId;
      token.uid = uid;
    }
    token.token = hashedRefreshToken;
    token.expiresAt = expiresAt;
    return this.refreshTokenRepository.save(token);
  }
  private generateAccessToken(
    user: User,
    uid: string,
  ): {
    token: string;
    expiresIn: string;
  } {
    const payload = {
      email: user.email,
      sub: user.id,
      uid,
    };
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    return { token, expiresIn };
  }

  private durationSeconds(timeExpr) {
    const units = { d: 86400, h: 3600, m: 60, s: 1 };
    const regex = /(\d+)([dhms])/g;

    let seconds = 0;
    let match;
    while ((match = regex.exec(timeExpr))) {
      seconds += parseInt(match[1]) * units[match[2]];
    }

    return seconds;
  }

  private generateRefreshToken(user: User): {
    refreshToken: string;
    expiresAt: Date;
    uid: string;
  } {
    const refreshTokenTtl = this.configService.get('JWT_REFRESH_EXPIRES_IN');

    const expiresAt = new Date(
      new Date().getTime() + 1000 * this.durationSeconds(refreshTokenTtl),
    );
    const uid = randomUUID();
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        uid,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      },
    );
    return { expiresAt, refreshToken, uid };
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
    return this.userRepository.findOneBy({ email });
  }

  public verifyRefreshToken(refreshToken: string) {
    return this.jwtService.verify<{
      email: string;
      sub: number;
      uid: string;
    }>(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validateRefreshToken(
    userId: number,
    token: string,
    uid: string,
  ): Promise<boolean> {
    const foundedToken = await this.refreshTokenRepository.findOne({
      where: {
        userId,
        uid,
      },
      select: ['id', 'token'],
    });
    if (token && (await compare(token, foundedToken.token))) {
      return true;
    }
    return false;
  }

  async getRefreshToken(userId: number, uid: string): Promise<string> {
    const identity = await this.refreshTokenRepository.findOneBy({
      userId,
      uid,
    });
    return identity?.token;
  }

  async refreshToken(userId: number, refreshToken: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new Error(AuthError.UNAUTHORIZED);
      const verifiedRefreshToken = this.verifyRefreshToken(refreshToken);
      if (!verifiedRefreshToken) throw new Error(AuthError.UNAUTHORIZED);
      const userRefreshToken = await this.getRefreshToken(
        user.id,
        verifiedRefreshToken.uid,
      );
      if (!userRefreshToken) throw new Error(AuthError.UNAUTHORIZED);

      const isRefreshTokenValid = await this.validateRefreshToken(
        user.id,
        refreshToken,
        verifiedRefreshToken.uid,
      );

      if (!isRefreshTokenValid) throw new Error(AuthError.UNAUTHORIZED);

      const accessToken = this.generateAccessToken(
        user,
        verifiedRefreshToken.uid,
      );
      return accessToken.token;
    } catch (e) {
      console.log(e);
    }
  }
}
