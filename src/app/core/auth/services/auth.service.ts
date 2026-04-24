import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  delay,
  map,
  mergeMap,
  of,
  timer,
} from 'rxjs';

import { AuthRole, AuthSession, AuthUser } from '../models/auth-session.model';

interface MockAuthAccount {
  email: string;
  password: string;
  session: AuthSession;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'saas-admin-dashboard.auth-session';
  // This catalog keeps authentication mockable while preserving a realistic service contract.
  private readonly mockAccounts: MockAuthAccount[] = [
    {
      email: 'admin@saas.com',
      password: 'Admin@123',
      session: {
        token: 'mock-enterprise-access-token',
        user: {
          id: 'admin-001',
          name: 'Admin User',
          email: 'admin@saas.com',
          role: 'admin',
          roleLabel: 'Administrator',
        },
      },
    },
    {
      email: 'user@saas.com',
      password: 'User@123',
      session: {
        token: 'mock-standard-access-token',
        user: {
          id: 'user-014',
          name: 'Product User',
          email: 'user@saas.com',
          role: 'user',
          roleLabel: 'Workspace User',
        },
      },
    },
  ];
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(
    this.readSession(),
  );

  readonly session$ = this.sessionSubject.asObservable();

  isAuthenticated(): boolean {
    return !!this.sessionSubject.value?.token;
  }

  getAccessToken(): string | null {
    return this.sessionSubject.value?.token ?? null;
  }

  getCurrentUser(): AuthUser | null {
    return this.sessionSubject.value?.user ?? null;
  }

  getCurrentRole(): AuthRole | null {
    return this.sessionSubject.value?.user.role ?? null;
  }

  hasAnyRole(roles: AuthRole[]): boolean {
    const currentRole = this.getCurrentRole();
    return !!currentRole && roles.includes(currentRole);
  }

  login(email: string, password: string): Observable<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedAccount = this.mockAccounts.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === password,
    );

    if (!matchedAccount) {
      return timer(700).pipe(
        mergeMap(() => {
          throw new Error('Invalid email or password. Please try again.');
        }),
      );
    }

    return of(matchedAccount.session).pipe(
      delay(900),
      map((session) => {
        this.persistSession(session);
        return session;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.sessionSubject.next(null);
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  private readSession(): AuthSession | null {
    const rawSession = localStorage.getItem(this.storageKey);

    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as AuthSession;
      return {
        ...session,
        user: {
          ...session.user,
          role:
            session.user.role === 'admin' || session.user.role === 'user'
              ? session.user.role
              : 'admin',
          roleLabel:
            session.user.roleLabel ??
            (session.user.role === 'user'
              ? 'Operations User'
              : 'Platform Administrator'),
        },
      };
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
