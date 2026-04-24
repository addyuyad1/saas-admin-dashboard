import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, Observable } from 'rxjs';

import { AuthRole } from '../../../../core/auth/models/auth-session.model';
import { UserDraft, UserSummary } from '../../models/user-summary.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly roles: AuthRole[] = ['admin', 'user'];
  readonly statuses: Array<UserSummary['status']> = ['Active', 'Invited', 'Suspended'];
  readonly users$: Observable<UserSummary[]>;

  isLoading = true;
  isSaving = false;
  isDeleting = false;
  editingUserId: string | null = null;
  showForm = false;
  errorMessage = '';

  readonly userForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    plan: ['Growth'],
    role: ['user' as AuthRole],
    status: ['Active' as UserSummary['status']],
  });

  constructor(
    private readonly usersService: UsersService,
  ) {
    this.users$ = usersService.users$;
  }

  ngOnInit(): void {
    this.usersService
      .getUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        error: () => {
          this.errorMessage = 'Users could not be loaded. Please refresh the page.';
        },
      });
  }

  openCreateForm(): void {
    this.showForm = true;
    this.editingUserId = null;
    this.userForm.reset({
      name: '',
      email: '',
      plan: 'Growth',
      role: 'user',
      status: 'Active',
    });
  }

  startEdit(user: UserSummary): void {
    this.showForm = true;
    this.editingUserId = user.id;
    this.userForm.reset({
      name: user.name,
      email: user.email,
      plan: user.plan || 'Growth',
      role: user.role,
      status: user.status,
    });
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingUserId = null;
    this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const draft = this.userForm.getRawValue() as UserDraft;
    this.isSaving = true;

    const request$ = this.editingUserId
      ? this.usersService.updateUser(this.editingUserId, draft)
      : this.usersService.createUser(draft);

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => this.cancelEdit(),
        error: () => {
          this.errorMessage =
            'The user record could not be saved. Please try again.';
        },
      });
  }

  deleteUser(userId: string): void {
    this.isDeleting = true;
    this.usersService
      .deleteUser(userId)
      .pipe(finalize(() => (this.isDeleting = false)))
      .subscribe({
        error: () => {
          this.errorMessage =
            'The user record could not be deleted. Please try again.';
        },
      });
  }
}
