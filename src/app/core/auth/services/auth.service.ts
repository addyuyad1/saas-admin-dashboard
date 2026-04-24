import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthSession } from '../models/auth-session.model';

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

  login(): void {
    const session: AuthSession = {
      token: 'mock-enterprise-access-token',
      user: {
        id: 'admin-001',
        name: 'Demo Admin',
        email: 'admin@saas-dashboard.local',
        role: 'Platform Administrator',
      },
    };

    this.persistSession(session);
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
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
