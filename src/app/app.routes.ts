import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authInterceptor } from './core/Interceptors/auth.interceptor';
import { AboutComponent } from './pages/about/about.component'; // Assuming AbortComponent is defined elsewhere
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component:AboutComponent, // Assuming AbortComponent is defined elsewhere
  }
  ,
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authInterceptor],
  },
  { path: '**', redirectTo: 'home' },
];
