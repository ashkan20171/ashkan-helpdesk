import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export type AppRole = 'admin' | 'manager' | 'agent' | 'customer';

export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  admin: ['dashboard.view','tickets.view','tickets.create','tickets.manage','users.view','users.manage','roles.manage','reports.view','billing.view','settings.manage','audit.view','knowledge.manage','portal.use','workforce.view','workforce.plan','profile.manage','security.manage','organization.members.manage'],
  manager: ['dashboard.view','tickets.view','tickets.create','tickets.manage','users.view','reports.view','audit.view','knowledge.manage','portal.use','workforce.view','workforce.plan','profile.manage','security.manage','organization.members.manage'],
  agent: ['dashboard.view','tickets.view','tickets.create','tickets.manage','reports.view','knowledge.manage','portal.use','workforce.view','profile.manage'],
  customer: ['dashboard.view','tickets.view','tickets.create','portal.use','profile.manage']
};

export function hasPermission(permission: string): boolean {
  const role = (localStorage.getItem('ashkan.demo.role') || 'customer') as AppRole;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const authenticated = localStorage.getItem('ashkan.demo.session') === 'true';
  if (!authenticated) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  const permission = _route.data?.['permission'] as string | undefined;
  if (permission && !hasPermission(permission)) {
    return router.createUrlTree(['/dashboard'], { queryParams: { denied: permission } });
  }
  return true;
};

export const permissionGuard = (permission: string): CanActivateFn => () => {
  const router = inject(Router);
  return hasPermission(permission) ? true : router.createUrlTree(['/dashboard'], { queryParams: { denied: permission } });
};
