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
  { path: 'studio/:id', component: ChannelPageComponent, canActivate: [authGuard] },
  { path: 'me/profile', component: UserProfileComponent, canActivate: [authGuard] },

  { path: 'profile', redirectTo: 'me/profile', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
