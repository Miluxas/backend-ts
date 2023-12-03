import { Injectable } from '@nestjs/common';

import { Role } from '../types/role.type';

const permissions: {
  [K in Role]: { method: string; url: string; desc: string; rbContent?: any }[];
} = {
  User: [
    {
      method: 'PUT',
      url: '/users/:userId',
      desc: 'The user edits his/her info',
    },
    {
      method: 'GET',
      url: '/users/:userId',
      desc: 'The user gets his/her info',
    },
    {
      method: 'PUT',
      url: '/auth/change-password',
      desc: 'The user changes his/her password',
    },
    { method: 'POST', url: '/medias', desc: 'The user adds media' },
    {
      method: '*',
      url: '/orders*',
      desc: 'The user manages orders',
      rbContent: { userId: '$userId' },
    }, 
    {
      method: '*',
      url: '/shopping-cart*',
      desc: 'The user manages shopping cart',
      rbContent: { userId: '$userId' },
    },
    {
      method: 'PUT',
      url: '/products/',
      desc: 'The user update review',
      rbContent: { userId: '$userId' },
    },
    {
      method: 'DELETE',
      url: '/products/',
      desc: 'The user remove review',
      rbContent: { userId: '$userId' },
    },
  ],
  Admin: [{ method: '*', url: '/*', desc: 'The admin has fully permission' }],
};
@Injectable()
export class RBACService {
  public checkAccess(
    roles: Role[],
    userId: number,
    method: string,
    url: string,
  ): { grant: boolean; rbContent?: any } {
    if (!roles || roles.length == 0) return { grant: false };
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
    if (permission && permission.rbContent) {
      const rbContent = JSON.parse(
        JSON.stringify(permission.rbContent).replace(
          '"$userId"',
          userId.toString(),
        ),
      );
      return { grant: true, rbContent };
    }
    return { grant: permission != null };
  }
}
