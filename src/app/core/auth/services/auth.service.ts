import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthRole, AuthSession } from '../models/auth-session.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'saas-admin-dashboard.auth-session';
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

  getCurrentRole(): AuthRole | null {
    return this.sessionSubject.value?.user.role ?? null;
  }

  hasAnyRole(roles: AuthRole[]): boolean {
    const currentRole = this.getCurrentRole();
    return !!currentRole && roles.includes(currentRole);
  }

  login(role: AuthRole = 'admin'): void {
    const session = this.buildSession(role);
    this.persistSession(session);
  }

  private buildSession(role: AuthRole): AuthSession {
    if (role === 'user') {
      return {
        token: 'mock-standard-access-token',
        user: {
          id: 'user-014',
          name: 'Taylor Morgan',
          email: 'taylor@saas-dashboard.local',
          role: 'user',
          roleLabel: 'Operations User',
        },
      };
    }

    return {
      token: 'mock-enterprise-access-token',
      user: {
        id: 'admin-001',
        name: 'Demo Admin',
        email: 'admin@saas-dashboard.local',
        role: 'admin',
        roleLabel: 'Platform Administrator',
      },
    };
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
