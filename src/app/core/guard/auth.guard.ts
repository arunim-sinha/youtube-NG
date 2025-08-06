import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('AuthGuard: Checking if user is logged in');
  authService.isLoggedIn();
  if (authService.isLoggedIn()) {
    console.log('AuthGuard: User is logged in');
    return true;
  } else {
    console.log('AuthGuard: User is not logged in, redirecting to login');
    router.navigate(['/']);
    return false;
  }
};
