import { Injectable } from '@angular/core';

import { UserSummary } from '../models/user-summary.model';

@Injectable()
export class UsersService {
  getUsers(): UserSummary[] {
    return [
      {
        name: 'Maya Patel',
        email: 'maya.patel@client.io',
        plan: 'Enterprise',
        lastSeen: '2 minutes ago',
      },
      {
        name: 'Samuel Reed',
        email: 'samuel.reed@client.io',
        plan: 'Growth',
        lastSeen: '18 minutes ago',
      },
      {
        name: 'Olivia Chen',
        email: 'olivia.chen@client.io',
        plan: '',
        lastSeen: 'Yesterday',
      },
    ];
  }
}
