import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { VideoListingComponent } from './features/video-listing/video-listing.component';
import { VideoViewComponent } from './features/video-view/video-view.component';
import { ChannelPageComponent } from './features/channel-page/channel-page.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: VideoListingComponent },
  { path: 'watch/:id', component: VideoViewComponent },
  { path: 'channel/:id', component: ChannelPageComponent },
  { path: 'me/profile', component: UserProfileComponent, canActivate: [authGuard] },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
  },
  { path: '**', redirectTo: '' },
];
