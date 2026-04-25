import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';

import { ThemeService } from '../../../core/services/theme.service';
import {
  SettingsSection,
  UserPreferences,
} from '../models/settings-section.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly storageKey = 'saas-admin-dashboard.preferences';
  private readonly preferencesSubject = new BehaviorSubject<UserPreferences>(
    this.readPreferences(),
  );

  readonly preferences$ = this.preferencesSubject.asObservable();

  constructor(private readonly themeService: ThemeService) {}

  getPreferences(): UserPreferences {
    return this.preferencesSubject.value;
  }

  getSections(): SettingsSection[] {
    return [
      {
        title: 'Workspace branding',
        description: 'Manage logos, colors, and white-label defaults.',
      },
      {
        title: 'Security policies',
        description: 'Centralize roles, session policies, and audit controls.',
      },
      {
        title: 'Billing operations',
        description: 'Configure invoicing, taxes, and finance notifications.',
      },
    ];
  }

  savePreferences(preferences: UserPreferences): Observable<UserPreferences> {
    return of(preferences).pipe(
      delay(300),
      tap((nextPreferences) => {
        localStorage.setItem(this.storageKey, JSON.stringify(nextPreferences));
        this.preferencesSubject.next(nextPreferences);
        this.themeService.setTheme(nextPreferences.theme);
      }),
    );
  }

  private readPreferences(): UserPreferences {
    const rawValue = localStorage.getItem(this.storageKey);

    if (!rawValue) {
      return {
        theme: this.themeService.getCurrentTheme(),
        compactMode: false,
        emailDigest: true,
        aiAssist: true,
        timezone: 'Asia/Calcutta',
      };
    }

    try {
      const parsed = JSON.parse(rawValue) as UserPreferences;
      return {
        ...parsed,
        theme: parsed.theme === 'dark' ? 'dark' : 'light',
      };
    } catch {
      localStorage.removeItem(this.storageKey);
      return {
        theme: this.themeService.getCurrentTheme(),
        compactMode: false,
        emailDigest: true,
        aiAssist: true,
        timezone: 'Asia/Calcutta',
      };
    }
  }
}
