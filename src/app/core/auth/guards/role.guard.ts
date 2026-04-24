import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { PermissionData } from '../models/permission.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const permissionData = route.data as PermissionData;
    const allowedRoles = permissionData.roles ?? [];

    if (!allowedRoles.length || this.authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    return this.router.createUrlTree(['/access-denied']);
  }
}
