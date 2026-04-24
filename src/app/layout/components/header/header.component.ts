import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
} from 'rxjs';

import { AuthSession, AuthUser } from '../../../core/auth/models/auth-session.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  AppNotification,
  NotificationsService,
} from '../../../core/services/notifications.service';
import {
  ConnectionState,
  RealtimeUpdatesService,
} from '../../../core/services/realtime-updates.service';
import { ThemeMode, ThemeService } from '../../../core/services/theme.service';
import { UserSummary } from '../../../features/users/models/user-summary.model';
import { UsersService } from '../../../features/users/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly session$: Observable<AuthSession | null>;
  readonly connectionState$: Observable<ConnectionState>;
  readonly notifications$: Observable<AppNotification[]>;
  readonly unreadCount$: Observable<number>;
  readonly theme$: Observable<ThemeMode>;
  readonly searchResults$: Observable<UserSummary[]>;
  readonly searchControl = new FormControl('', { nonNullable: true });

  isMenuOpen = false;
  isNotificationsOpen = false;
  isSearchOpen = false;

  constructor(
    private readonly authService: AuthService,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly notificationsService: NotificationsService,
    private readonly router: Router,
    realtimeUpdatesService: RealtimeUpdatesService,
    private readonly themeService: ThemeService,
    usersService: UsersService,
  ) {
    this.session$ = authService.session$;
    this.connectionState$ = realtimeUpdatesService.connectionState$;
    this.notifications$ = notificationsService.notifications$;
    this.unreadCount$ = notificationsService.unreadCount$;
    this.theme$ = themeService.theme$;
    this.searchResults$ = combineLatest([
      usersService.users$,
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounceTime(120),
        distinctUntilChanged(),
      ),
    ]).pipe(
      map(([users, term]) => this.filterUsers(users, term)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.isSearchOpen = term.trim().length > 0;
      });
  }

  signOut(): void {
    this.closeOverlays();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    const nextState = !this.isMenuOpen;
    this.closeOverlays();
    this.isMenuOpen = nextState;
  }

  toggleNotifications(): void {
    const nextState = !this.isNotificationsOpen;
    this.closeOverlays();
    this.isNotificationsOpen = nextState;
  }

  openSearch(): void {
    if (this.searchControl.value.trim()) {
      this.closeOverlays();
      this.isSearchOpen = true;
    }
  }

  openProfile(): void {
    this.closeOverlays();
    void this.router.navigate(['/settings'], { fragment: 'profile' });
  }

  openSettings(): void {
    this.closeOverlays();
    void this.router.navigate(['/settings']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isMenuOpen = false;
  }

  submitGlobalSearch(): void {
    const query = this.searchControl.value.trim();

    if (!query) {
      this.isSearchOpen = false;
      return;
    }

    this.closeOverlays();
    void this.router.navigate(['/users'], {
      queryParams: { search: query },
    });
  }

  selectSearchResult(user: UserSummary): void {
    this.searchControl.setValue(user.name, { emitEvent: false });
    this.closeOverlays();
    void this.router.navigate(['/users'], {
      queryParams: { search: user.name },
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.isSearchOpen = false;
  }

  markNotificationAsRead(notificationId: string): void {
    this.notificationsService.markAsRead(notificationId);
  }

  markAllNotificationsAsRead(): void {
    this.notificationsService.markAllAsRead();
  }

  getInitials(user: Pick<AuthUser, 'name'>): string {
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeOverlays();
    }
  }

  private filterUsers(users: UserSummary[], term: string): UserSummary[] {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      return [];
    }

    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(normalizedTerm) ||
          user.email.toLowerCase().includes(normalizedTerm) ||
          user.role.toLowerCase().includes(normalizedTerm),
      )
      .slice(0, 5);
  }

  private closeOverlays(): void {
    this.isMenuOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false;
  }
}
