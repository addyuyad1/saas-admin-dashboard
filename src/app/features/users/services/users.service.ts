import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersApiService } from '../../../core/services/api/users.service';
import { UserDraft, UserSummary } from '../models/user-summary.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly users$: Observable<UserSummary[]>;

  constructor(private readonly usersApiService: UsersApiService) {
    this.users$ = usersApiService.users$;
  }

  getUsers(): Observable<UserSummary[]> {
    return this.usersApiService.getUsers();
  }

  createUser(draft: UserDraft): Observable<UserSummary> {
    return this.usersApiService.createUser(draft);
  }

  updateUser(userId: string, draft: UserDraft): Observable<UserSummary> {
    return this.usersApiService.updateUser(userId, draft);
  }

  deleteUser(userId: string): Observable<void> {
    return this.usersApiService.deleteUser(userId);
  }

  getUserById(userId: string): Observable<UserSummary | undefined> {
    return this.usersApiService.getUserById(userId);
  }
}
