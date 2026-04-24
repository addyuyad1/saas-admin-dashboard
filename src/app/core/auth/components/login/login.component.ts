import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthRole } from '../../models/auth-session.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.navigateToRedirect();
    }
  }

  signIn(role: AuthRole): void {
    this.authService.login(role);
    this.navigateToRedirect();
  }

  private navigateToRedirect(): void {
    const redirectTo =
      this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';

    void this.router.navigateByUrl(redirectTo);
  }
}
