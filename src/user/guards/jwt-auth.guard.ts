import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/public.decorator';
import { RBACService } from '../services/rbac.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private rBACService: RBACService) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      throw new UnauthorizedException();
    }
    const bearer: string = context.switchToHttp().getRequest()
      .headers?.authorization;
    await this.tokenValidate(bearer);
    const { user, url, method } = context.switchToHttp().getRequest();
    const accessStatus = this.rBACService.checkAccess(
      user.roles,
      user.id,
      method,
      url,
    );
    context.switchToHttp().getRequest()['rbContent']=accessStatus.rbContent
    return accessStatus.grant;
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
