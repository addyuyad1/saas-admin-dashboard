import { ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthUser, AuthSession } from '../../../core/auth/models/auth-session.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  ConnectionState,
  RealtimeUpdatesService,
} from '../../../core/services/realtime-updates.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly session$: Observable<AuthSession | null>;
  readonly connectionState$: Observable<ConnectionState>;
  isMenuOpen = false;

  constructor(
    private readonly authService: AuthService,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly router: Router,
    private readonly realtimeUpdatesService: RealtimeUpdatesService,
  ) {
    this.session$ = authService.session$;
    this.connectionState$ = realtimeUpdatesService.connectionState$;
  }

  signOut(): void {
    this.isMenuOpen = false;
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openProfile(): void {
    this.isMenuOpen = false;
    void this.router.navigate(['/settings'], { fragment: 'profile' });
  }

  openSettings(): void {
    this.isMenuOpen = false;
    void this.router.navigate(['/settings']);
  }

  getInitials(user: AuthUser): string {
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
      this.isMenuOpen = false;
    }
  }
}
