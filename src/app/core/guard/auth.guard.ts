import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']); 
};
