import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/video.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private base = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.base}/${id}`);
  }

  registerView(id: string, watchedSeconds = 0): Observable<{ views: number }> {
    return this.http.post<{ views: number }>(`${this.base}/${id}/view`, { watchedSeconds });
  }

  react(id: string, type: 'like' | 'dislike'): Observable<{ myReaction: 'like' | 'dislike' | null }> {
    return this.http.post<{ myReaction: 'like' | 'dislike' | null }>(`${this.base}/${id}/like`, { type });
  }

  getRecommendations(limit = 20): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.base}/recommendations`, { params: { limit } });
  }

  getRelated(id: string, limit = 15): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.base}/${id}/related`, { params: { limit } });
  }

  search(query: string): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.base}/search`, { params: { q: query } });
  }

  getChannelVideos(channelId: string): Observable<Video[]> {
    return this.http.get<Video[]>(`${environment.apiUrl}/channels/${channelId}/videos`);
  }

  upload(formData: FormData): Observable<Video> {
    return this.http.post<Video>(this.base, formData);
  }

  update(id: string, changes: Partial<Video>): Observable<Video> {
    return this.http.patch<Video>(`${this.base}/${id}`, changes);
  }

  setVisibility(id: string, visibility: 'public' | 'private' | 'unlisted'): Observable<Video> {
    return this.update(id, { visibility });
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
