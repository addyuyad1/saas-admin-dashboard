import { Injectable } from '@angular/core';

export interface NavigationItem {
  label: string;
  path: string;
  description: string;
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
    },
    {
      label: 'Users',
      path: '/users',
      description: 'Accounts and lifecycle',
    },
    {
      label: 'Analytics',
      path: '/analytics',
      description: 'Insights and trends',
    },
    {
      label: 'Settings',
      path: '/settings',
      description: 'System configuration',
    },
  ];
}
