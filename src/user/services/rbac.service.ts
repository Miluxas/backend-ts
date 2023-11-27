import { Injectable } from '@nestjs/common';

import { Role } from '../types/role.type';

const permissions: {
  [K in Role]: { method: string; url: string; desc?: string }[];
} = {
  User: [
    { method: 'PUT', url: '/users/:userId', desc: 'user edit itself info' },
  ],
  Admin: [{ method: '*', url: '/*', desc: 'admin has fully permission' }],
};
@Injectable()
export class RBACService {
  public checkAccess(
    roles: Role[],
    userId: number,
    method: string,
    url: string,
  ): boolean {
    if (!roles || roles.length == 0) return false;
    const rolePermissions = roles.reduce((prev, curr) => {
      prev.push(...permissions[curr]);
      return prev;
    }, []);
    const permission = rolePermissions.find(
      (p) =>
        (p.method == '*' || p.method == method) &&
        (p.url.replace(':userId', userId.toString()) == url ||
          url.startsWith(p.url.split('*')[0])),
    );

    return permission != null;
  }
}
