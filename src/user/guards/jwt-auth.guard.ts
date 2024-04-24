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
  exceptionUrlList=['/auth/refresh'];
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    try {
      if(this.exceptionUrlList.includes(context.switchToHttp().getRequest().url)){
        return true;
      }

      const baseGuardResult = await super.canActivate(context);
      if (!baseGuardResult) {
        throw new UnauthorizedException();
      }

      const bearer: string = context.switchToHttp().getRequest()
        .headers?.authorization;
      if (!bearer) {
        throw new UnauthorizedException();
      }
      const token = this.getToken(bearer);
      if (!token) {
        throw new UnauthorizedException();
      }
      const { user, url, method } = context.switchToHttp().getRequest();

      const accessStatus = this.rBACService.checkAccess(
        user.roles,
        user.id,
        method,
        url,
      );
      context.switchToHttp().getRequest()['rbContent'] = accessStatus.rbContent;
      if (!accessStatus.grant) throw new UnauthorizedException();
    } catch {
      if (!isPublic) throw new UnauthorizedException();
    }
    return true;
  }

  private getToken(bearer: string): string | void {
    if (!bearer) return;
    return bearer.split(' ')[1];
  }
}
