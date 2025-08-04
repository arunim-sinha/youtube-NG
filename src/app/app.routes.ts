import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component'; // Assuming AbortComponent is defined elsewhere
import { authGuard } from './core/guard/auth.guard';
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
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'home' },
];
