export interface ChannelRef {
  _id: string;
  username: string;
  avatarUrl?: string;
  subscriberCount?: number;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  channel: ChannelRef;
  tags: string[];
  category: string;
  visibility: 'public' | 'private' | 'unlisted';
  views: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  myReaction?: 'like' | 'dislike' | null;
  createdAt: string;
  updatedAt: string;
}
