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
      plan: 'Enterprise',
      lastSeen: '2 minutes ago',
      role: 'admin',
      status: 'Active',
    },
    {
      id: 'user-101',
      name: 'Samuel Reed',
      email: 'samuel.reed@client.io',
      plan: 'Growth',
      lastSeen: '18 minutes ago',
      role: 'user',
      status: 'Active',
    },
    {
      id: 'user-102',
      name: 'Olivia Chen',
      email: 'olivia.chen@client.io',
      plan: '',
      lastSeen: 'Yesterday',
      role: 'user',
      status: 'Invited',
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
