import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UserSummary } from '../../models/user-summary.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {
  readonly users: UserSummary[];

  constructor(private readonly usersService: UsersService) {
    this.users = usersService.getUsers();
  }
}
