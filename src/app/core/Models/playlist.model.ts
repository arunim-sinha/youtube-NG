import { Video } from './video.model';

export interface Playlist {
  _id: string;
  title: string;
  owner: string;
  videos: Video[];
  visibility: 'public' | 'private';
}
