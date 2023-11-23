import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      throw new UnauthorizedException();
    }
    const bearer: string = context.switchToHttp().getRequest()
      .headers?.authorization;
    await this.tokenValidate(bearer);
    return true;
  }

  private async tokenValidate(bearer: string) {
    if (!bearer) throw new UnauthorizedException();
    const token = this.getToken(bearer);
    if (!token) throw new UnauthorizedException();
  }

  private getToken(bearer: string): string | void {
    if (!bearer) return;
    return bearer.split(' ')[1];
  }
}
