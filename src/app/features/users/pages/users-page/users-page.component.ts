import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  merge,
  shareReplay,
  startWith,
} from 'rxjs';

import { AuthRole } from '../../../../core/auth/models/auth-session.model';
import { UserDraft, UserSummary } from '../../models/user-summary.model';
import { UsersService } from '../../services/users.service';

type UserSortOption = 'name-asc' | 'name-desc' | 'role-asc' | 'status-asc';

interface UsersTableViewModel {
  users: UserSummary[];
  total: number;
  page: number;
  pageSize: 5 | 10;
  totalPages: number;
  start: number;
  end: number;
}

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly skeletonRows = [1, 2, 3, 4, 5];
  readonly roles: AuthRole[] = ['admin', 'user'];
  readonly statuses: Array<UserSummary['status']> = [
    'Active',
    'Invited',
    'Suspended',
  ];
  readonly teams = [
    'Operations',
    'Success',
    'Product',
    'Finance',
    'Marketing',
    'Sales',
    'Support',
    'IT',
    'Onboarding',
  ];
  readonly users$: Observable<UserSummary[]>;
  readonly filteredUsers$: Observable<UserSummary[]>;
  readonly usersTableVm$: Observable<UsersTableViewModel>;
  readonly searchControl = this.formBuilder.nonNullable.control('');
  readonly roleFilterControl =
    this.formBuilder.nonNullable.control<'all' | AuthRole>('all');
  readonly statusFilterControl =
    this.formBuilder.nonNullable.control<'all' | UserSummary['status']>('all');
  readonly sortControl =
    this.formBuilder.nonNullable.control<UserSortOption>('name-asc');
  readonly pageSizeControl = this.formBuilder.nonNullable.control<5 | 10>(5);

  isLoading = true;
  isSaving = false;
  isDeleting = false;
  updatingUserId: string | null = null;
  editingUserId: string | null = null;
  recentlyCreatedUserId: string | null = null;
  showForm = false;
  errorMessage = '';
  deleteCandidate: UserSummary | null = null;

  private readonly currentPageSubject = new BehaviorSubject(1);

  readonly userForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    title: ['', [Validators.required, Validators.minLength(2)]],
    team: ['Operations', [Validators.required]],
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

    this.usersTableVm$ = combineLatest([
      this.filteredUsers$,
      this.pageSizeControl.valueChanges.pipe(
        startWith(this.pageSizeControl.value),
      ),
      this.currentPageSubject.asObservable(),
    ]).pipe(
      map(([users, pageSize, requestedPage]) => {
        const total = users.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const page = total ? Math.min(requestedPage, totalPages) : 1;
        const startIndex = total ? (page - 1) * pageSize : 0;
        const endIndex = total ? Math.min(startIndex + pageSize, total) : 0;

        return {
          users: users.slice(startIndex, endIndex),
          total,
          page,
          pageSize,
          totalPages,
          start: total ? startIndex + 1 : 0,
          end: endIndex,
        };
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  ngOnInit(): void {
    this.loadUsers();

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

    merge(
      this.searchControl.valueChanges,
      this.roleFilterControl.valueChanges,
      this.statusFilterControl.valueChanges,
      this.sortControl.valueChanges,
      this.pageSizeControl.valueChanges,
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPageSubject.next(1);
      });
  }

  openCreateForm(): void {
    this.showForm = true;
    this.editingUserId = null;
    this.userForm.reset({
      name: '',
      email: '',
      title: '',
      team: 'Operations',
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
      title: user.title,
      team: user.team,
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
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe({
        next: (savedUser) => {
          if (!this.editingUserId) {
            this.recentlyCreatedUserId = savedUser.id;
            this.clearFilters();
          }

          this.cancelEdit();
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.errorMessage =
            'The user record could not be saved. Please try again.';
        },
      });
  }

  promptDelete(user: UserSummary): void {
    this.deleteCandidate = user;
    this.changeDetectorRef.markForCheck();
  }

  cancelDelete(): void {
    this.deleteCandidate = null;
    this.changeDetectorRef.markForCheck();
  }

  confirmDelete(): void {
    if (!this.deleteCandidate) {
      return;
    }

    const userId = this.deleteCandidate.id;
    this.isDeleting = true;
    this.usersService
      .deleteUser(userId)
      .pipe(finalize(() => (this.isDeleting = false)))
      .subscribe({
        next: () => {
          if (this.recentlyCreatedUserId === userId) {
            this.recentlyCreatedUserId = null;
          }

          this.deleteCandidate = null;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.errorMessage =
            'The user record could not be deleted. Please try again.';
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleFilterControl.setValue('all');
    this.statusFilterControl.setValue('all');
    this.sortControl.setValue('name-asc');
    this.currentPageSubject.next(1);
  }

  setPage(page: number): void {
    this.currentPageSubject.next(Math.max(1, page));
  }

  trackByUserId(_: number, user: UserSummary): string {
    return user.id;
  }

  getUserInitials(user: UserSummary): string {
    const nameParts = user.name.split(' ').filter(Boolean);
    const firstInitial = nameParts[0]?.charAt(0) ?? '';
    const lastInitial = nameParts[1]?.charAt(0) ?? '';

    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  getStatusLabel(status: UserSummary['status']): string {
    switch (status) {
      case 'Invited':
        return 'Pending';
      case 'Suspended':
        return 'Disabled';
      case 'Active':
      default:
        return 'Active';
    }
  }

  getStatusTone(status: UserSummary['status']): string {
    switch (status) {
      case 'Invited':
        return 'pending';
      case 'Suspended':
        return 'disabled';
      case 'Active':
      default:
        return 'active';
    }
  }

  getRoleTone(role: AuthRole): string {
    return role === 'admin' ? 'admin' : 'user';
  }

  getToggleActionLabel(user: UserSummary): string {
    return user.status === 'Active' ? 'Disable' : 'Activate';
  }

  toggleUserStatus(user: UserSummary): void {
    const nextStatus: UserSummary['status'] =
      user.status === 'Active' ? 'Suspended' : 'Active';

    const draft: UserDraft = {
      name: user.name,
      email: user.email,
      title: user.title,
      team: user.team,
      plan: user.plan,
      role: user.role,
      status: nextStatus,
    };

    this.updatingUserId = user.id;
    this.usersService
      .updateUser(user.id, draft)
      .pipe(
        finalize(() => {
          this.updatingUserId = null;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe({
        error: () => {
          this.errorMessage =
            'The user status could not be updated. Please try again.';
        },
      });
  }

  private filterAndSortUsers(
    users: UserSummary[],
    searchTerm: string,
    role: 'all' | AuthRole,
    status: 'all' | UserSummary['status'],
    sort: UserSortOption,
  ): UserSummary[] {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users
      .filter((user) => {
        const matchesSearch =
          !normalizedSearch ||
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch) ||
          user.plan.toLowerCase().includes(normalizedSearch) ||
          user.title.toLowerCase().includes(normalizedSearch) ||
          user.team.toLowerCase().includes(normalizedSearch);
        const matchesRole = role === 'all' || user.role === role;
        const matchesStatus = status === 'all' || user.status === status;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .slice()
      .sort((leftUser, rightUser) => {
        if (this.recentlyCreatedUserId) {
          if (leftUser.id === this.recentlyCreatedUserId) {
            return -1;
          }

          if (rightUser.id === this.recentlyCreatedUserId) {
            return 1;
          }
        }

        return this.compareUsers(leftUser, rightUser, sort);
      });
  }

  private compareUsers(
    leftUser: UserSummary,
    rightUser: UserSummary,
    sort: UserSortOption,
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

  private loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    this.usersService
      .getUsers()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe({
        error: () => {
          this.errorMessage = 'Users could not be loaded. Please refresh the page.';
        },
      });
  }
}
