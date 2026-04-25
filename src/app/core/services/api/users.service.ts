import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  delay,
  map,
  of,
  tap,
} from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserDraft, UserModel } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;
  private readonly fallbackUsers: UserModel[] = [
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
  ];
  private readonly usersSubject = new BehaviorSubject<UserModel[]>(
    this.fallbackUsers,
  );

  readonly users$ = this.usersSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl).pipe(
      map((users) => users.map((user) => this.normalizeUser(user))),
      tap((users) => {
        this.usersSubject.next(users);
      }),
      catchError(() => of(this.usersSubject.value).pipe(delay(350))),
    );
  }

  createUser(draft: UserDraft): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, draft).pipe(
      map((user) => this.normalizeUser(user, 'Just now')),
      tap((user) => {
        this.usersSubject.next([user, ...this.usersSubject.value]);
      }),
      catchError(() => {
        const createdUser = this.buildFallbackUser(draft);

        this.usersSubject.next([createdUser, ...this.usersSubject.value]);
        return of(createdUser).pipe(delay(400));
      }),
    );
  }

  updateUser(userId: string, draft: UserDraft): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/${userId}`, draft).pipe(
      map((user) => this.normalizeUser(user, 'Just now', userId, draft)),
      tap((updatedUser) => {
        this.usersSubject.next(
          this.usersSubject.value.map((user) =>
            user.id === userId ? updatedUser : user,
          ),
        );
      }),
      catchError(() => {
        const updatedUser = this.normalizeUser(
          {
            id: userId,
            ...draft,
          },
          'Just now',
        );

        this.usersSubject.next(
          this.usersSubject.value.map((user) =>
            user.id === userId ? updatedUser : user,
          ),
        );
        return of(updatedUser).pipe(delay(400));
      }),
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        this.removeLocalUser(userId);
      }),
      catchError(() =>
        of(void 0).pipe(
          delay(300),
          tap(() => {
            this.removeLocalUser(userId);
          }),
        ),
      ),
    );
  }

  getUserById(userId: string): Observable<UserModel | undefined> {
    return this.users$.pipe(
      map((users) => users.find((user) => user.id === userId)),
    );
  }

  private buildFallbackUser(draft: UserDraft): UserModel {
    return {
      id: `user-${Date.now()}`,
      ...draft,
      lastSeen: 'Just now',
    };
  }

  private normalizeUser(
    user: Partial<UserModel>,
    lastSeen = 'Recently updated',
    userId?: string,
    draft?: UserDraft,
  ): UserModel {
    return {
      id: user.id ?? userId ?? `user-${Date.now()}`,
      name: user.name ?? draft?.name ?? 'Unknown user',
      email: user.email ?? draft?.email ?? '',
      title: user.title ?? draft?.title ?? 'Team member',
      team: user.team ?? draft?.team ?? 'Operations',
      plan: user.plan ?? draft?.plan ?? '',
      lastSeen: user.lastSeen ?? lastSeen,
      role: user.role ?? draft?.role ?? 'user',
      status: user.status ?? draft?.status ?? 'Active',
    };
  }

  private removeLocalUser(userId: string): void {
    this.usersSubject.next(
      this.usersSubject.value.filter((user) => user.id !== userId),
    );
  }
}
