import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthSession } from '../../../core/auth/models/auth-session.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  ConnectionState,
  RealtimeUpdatesService,
} from '../../../core/services/realtime-updates.service';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

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
  readonly theme$: Observable<ThemeMode>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly realtimeUpdatesService: RealtimeUpdatesService,
    private readonly themeService: ThemeService,
  ) {
    this.session$ = authService.session$;
    this.connectionState$ = realtimeUpdatesService.connectionState$;
    this.theme$ = themeService.theme$;
  }

  signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
