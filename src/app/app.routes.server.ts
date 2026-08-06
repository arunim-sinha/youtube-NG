import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'watch/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'channel/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'me/profile',
    renderMode: RenderMode.Server,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
