import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../Models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getComments(videoId: string, page = 1): Observable<{ page: number; comments: Comment[] }> {
    return this.http.get<{ page: number; comments: Comment[] }>(
      `${this.base}/videos/${videoId}/comments`,
      { params: { page } as any }
    );
  }

  addComment(videoId: string, text: string, parentComment?: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.base}/videos/${videoId}/comments`, { text, parentComment });
  }

  deleteComment(commentId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/comments/${commentId}`);
  }
}
