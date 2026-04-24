import { Injectable } from '@angular/core';

import { AuthRole } from '../auth/models/auth-session.model';

export interface NavigationItem {
  label: string;
  path: string;
  description: string;
  roles?: AuthRole[];
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly items: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      description: 'Executive overview',
      roles: ['admin', 'user'],
    },
    {
      label: 'Users',
      path: '/users',
      description: 'Accounts and lifecycle',
      roles: ['admin'],
    },
    {
      label: 'Analytics',
      path: '/analytics',
      description: 'Insights and trends',
      roles: ['admin', 'user'],
    },
    {
      label: 'Settings',
      path: '/settings',
      description: 'System configuration',
      roles: ['admin', 'user'],
    },
  ];

  getVisibleItems(role: AuthRole | null): NavigationItem[] {
    if (!role) {
      return [];
    }

    return this.items.filter((item) => !item.roles || item.roles.includes(role));
  }
}
