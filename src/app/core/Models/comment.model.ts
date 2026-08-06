export interface CommentAuthor {
  _id: string;
  username: string;
  avatarUrl?: string;
}

export interface Comment {
  _id: string;
  video: string;
  author: CommentAuthor;
  text: string;
  parentComment: string | null;
  likeCount: number;
  replies?: Comment[];
  createdAt: string;
}
