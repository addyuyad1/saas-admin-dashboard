import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, tap } from 'rxjs';

import { UserDraft, UserSummary } from '../models/user-summary.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly usersSubject = new BehaviorSubject<UserSummary[]>([
    {
      id: 'user-100',
      name: 'Maya Patel',
      email: 'maya.patel@client.io',
      title: 'Director of Operations',
      team: 'Operations',
      plan: 'Enterprise',
      lastSeen: '2 minutes ago',
      role: 'admin',
      status: 'Active',
    },
    {
      id: 'user-101',
      name: 'Samuel Reed',
      email: 'samuel.reed@client.io',
      title: 'Customer Success Lead',
      team: 'Success',
      plan: 'Growth',
      lastSeen: '18 minutes ago',
      role: 'user',
      status: 'Active',
    },
    {
      id: 'user-102',
      name: 'Olivia Chen',
      email: 'olivia.chen@client.io',
      title: 'Revenue Analyst',
      team: 'Finance',
      plan: '',
      lastSeen: 'Yesterday',
      role: 'user',
      status: 'Invited',
    },
    {
      id: 'user-103',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@client.io',
      title: 'Product Manager',
      team: 'Product',
      plan: 'Starter',
      lastSeen: '5 minutes ago',
      role: 'user',
      status: 'Active',
    },
    {
      id: 'user-104',
      name: 'Sophia Turner',
      email: 'sophia.turner@client.io',
      title: 'Platform Administrator',
      team: 'IT',
      plan: 'Enterprise',
      lastSeen: '12 minutes ago',
      role: 'admin',
      status: 'Active',
    },
    {
      id: 'user-105',
      name: 'Noah Williams',
      email: 'noah.williams@client.io',
      title: 'Growth Strategist',
      team: 'Marketing',
      plan: 'Growth',
      lastSeen: '32 minutes ago',
      role: 'user',
      status: 'Active',
    },
    {
      id: 'user-106',
      name: 'Priya Nair',
      email: 'priya.nair@client.io',
      title: 'Solutions Consultant',
      team: 'Sales',
      plan: 'Enterprise',
      lastSeen: '1 hour ago',
      role: 'user',
      status: 'Active',
    },
    {
      id: 'user-107',
      name: 'Lucas Bennett',
      email: 'lucas.bennett@client.io',
      title: 'Support Specialist',
      team: 'Support',
      plan: 'Growth',
      lastSeen: 'Today',
      role: 'user',
      status: 'Suspended',
    },
    {
      id: 'user-108',
      name: 'Ananya Rao',
      email: 'ananya.rao@client.io',
      title: 'Lifecycle Marketer',
      team: 'Marketing',
      plan: 'Starter',
      lastSeen: 'Today',
      role: 'user',
      status: 'Invited',
    },
    {
      id: 'user-109',
      name: 'Ethan Brooks',
      email: 'ethan.brooks@client.io',
      title: 'Implementation Manager',
      team: 'Onboarding',
      plan: 'Growth',
      lastSeen: 'Yesterday',
      role: 'user',
      status: 'Active',
    },
    {
      id: 'user-110',
      name: 'Zara Khan',
      email: 'zara.khan@client.io',
      title: 'Finance Controller',
      team: 'Finance',
      plan: 'Enterprise',
      lastSeen: '2 days ago',
      role: 'admin',
      status: 'Active',
    },
    {
      id: 'user-111',
      name: 'Daniel Park',
      email: 'daniel.park@client.io',
      title: 'Account Executive',
      team: 'Sales',
      plan: 'Growth',
      lastSeen: '3 days ago',
      role: 'user',
      status: 'Suspended',
    },
  ]);

  readonly users$ = this.usersSubject.asObservable();

  getUsers(): Observable<UserSummary[]> {
    return this.users$.pipe(delay(350));
  }

  createUser(draft: UserDraft): Observable<UserSummary> {
    const createdUser: UserSummary = {
      id: `user-${Date.now()}`,
      ...draft,
      lastSeen: 'Just now',
    };

    return of(createdUser).pipe(
      delay(400),
      tap((user) => {
        this.usersSubject.next([user, ...this.usersSubject.value]);
      }),
    );
  }

  updateUser(userId: string, draft: UserDraft): Observable<UserSummary> {
    return of({
      id: userId,
      ...draft,
      lastSeen: 'Just now',
    }).pipe(
      delay(400),
      tap((updatedUser) => {
        this.usersSubject.next(
          this.usersSubject.value.map((user) =>
            user.id === userId ? updatedUser : user,
          ),
        );
      }),
    );
  }

  deleteUser(userId: string): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      tap(() => {
        this.usersSubject.next(
          this.usersSubject.value.filter((user) => user.id !== userId),
        );
      }),
    );
  }

  getUserById(userId: string): Observable<UserSummary | undefined> {
    return this.users$.pipe(
      map((users) => users.find((user) => user.id === userId)),
    );
  }
}
