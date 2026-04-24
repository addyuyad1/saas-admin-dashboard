import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'saas-admin-dashboard.theme';
  private readonly themeSubject = new BehaviorSubject<ThemeMode>(
    this.readStoredTheme(),
  );

  readonly theme$ = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyTheme(this.themeSubject.value);
  }

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    this.setTheme(this.themeSubject.value === 'light' ? 'dark' : 'light');
  }

  private readStoredTheme(): ThemeMode {
    const storedTheme = localStorage.getItem(this.storageKey);
    return storedTheme === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
