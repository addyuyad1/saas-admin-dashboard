import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AuthRole } from '../../../core/auth/models/auth-session.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  NavigationItem,
  NavigationService,
} from '../../../core/services/navigation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly navigationItems$: Observable<NavigationItem[]>;

  constructor(
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
  ) {
    this.navigationItems$ = authService.session$.pipe(
      map((session) => session?.user.role ?? null),
      map((role: AuthRole | null) => navigationService.getVisibleItems(role)),
    );
  }
}
