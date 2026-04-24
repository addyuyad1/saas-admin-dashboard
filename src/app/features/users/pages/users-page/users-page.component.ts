import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  shareReplay,
  startWith,
} from 'rxjs';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly roles: AuthRole[] = ['admin', 'user'];
  readonly statuses: Array<UserSummary['status']> = [
    'Active',
    'Invited',
    'Suspended',
  ];
  readonly users$: Observable<UserSummary[]>;
  readonly filteredUsers$: Observable<UserSummary[]>;
  readonly searchControl = this.formBuilder.nonNullable.control('');
  readonly roleFilterControl =
    this.formBuilder.nonNullable.control<'all' | AuthRole>('all');
  readonly statusFilterControl =
    this.formBuilder.nonNullable.control<'all' | UserSummary['status']>('all');
  readonly sortControl = this.formBuilder.nonNullable.control<
    'name-asc' | 'name-desc' | 'role-asc' | 'status-asc'
  >('name-asc');

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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usersService: UsersService,
  ) {
    this.users$ = usersService.users$;
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.roleFilterControl.valueChanges.pipe(
        startWith(this.roleFilterControl.value),
      ),
      this.statusFilterControl.valueChanges.pipe(
        startWith(this.statusFilterControl.value),
      ),
      this.sortControl.valueChanges.pipe(startWith(this.sortControl.value)),
    ]).pipe(
      map(([users, searchTerm, role, status, sort]) =>
        this.filterAndSortUsers(users, searchTerm, role, status, sort),
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
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

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const search = params.get('search') ?? '';

        if (search !== this.searchControl.value) {
          this.searchControl.setValue(search);
        }
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => {
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: search || null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
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

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleFilterControl.setValue('all');
    this.statusFilterControl.setValue('all');
    this.sortControl.setValue('name-asc');
  }

  private filterAndSortUsers(
    users: UserSummary[],
    searchTerm: string,
    role: 'all' | AuthRole,
    status: 'all' | UserSummary['status'],
    sort: 'name-asc' | 'name-desc' | 'role-asc' | 'status-asc',
  ): UserSummary[] {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users
      .filter((user) => {
        const matchesSearch =
          !normalizedSearch ||
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch) ||
          user.plan.toLowerCase().includes(normalizedSearch);
        const matchesRole = role === 'all' || user.role === role;
        const matchesStatus = status === 'all' || user.status === status;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .slice()
      .sort((leftUser, rightUser) => this.compareUsers(leftUser, rightUser, sort));
  }

  private compareUsers(
    leftUser: UserSummary,
    rightUser: UserSummary,
    sort: 'name-asc' | 'name-desc' | 'role-asc' | 'status-asc',
  ): number {
    switch (sort) {
      case 'name-desc':
        return rightUser.name.localeCompare(leftUser.name);
      case 'role-asc':
        return (
          leftUser.role.localeCompare(rightUser.role) ||
          leftUser.name.localeCompare(rightUser.name)
        );
      case 'status-asc':
        return (
          leftUser.status.localeCompare(rightUser.status) ||
          leftUser.name.localeCompare(rightUser.name)
        );
      case 'name-asc':
      default:
        return leftUser.name.localeCompare(rightUser.name);
    }
  }
}
