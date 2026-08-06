import { Video } from './video.model';

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface WatchHistoryEntry {
  _id: string;
  video: Video;
  watchedSeconds: number;
  lastWatchedAt: string;
}
