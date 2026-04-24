import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthSession } from '../../../core/auth/models/auth-session.model';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly session$: Observable<AuthSession | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.session$ = authService.session$;
  }

  signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
