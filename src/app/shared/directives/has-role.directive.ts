import { DestroyRef, Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

import { AuthRole } from '../../core/auth/models/auth-session.model';
import { AuthService } from '../../core/auth/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private allowedRoles: AuthRole[] = [];
  private hasView = false;

  @Input()
  set appHasRole(value: AuthRole | AuthRole[]) {
    this.allowedRoles = Array.isArray(value) ? value : [value];
    this.updateView(this.authService.getCurrentRole());
  }

  constructor() {
    this.authService.session$
      .pipe(
        map((session) => session?.user.role ?? null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((role) => this.updateView(role));
  }

  private updateView(currentRole: AuthRole | null): void {
    const canView = !!currentRole && this.allowedRoles.includes(currentRole);

    if (canView && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }

    if (!canView && this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
    }
  }
}
