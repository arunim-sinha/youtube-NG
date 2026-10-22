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
    path: 'studio/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'me/profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
