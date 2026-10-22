import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, WatchHistoryEntry } from '../models/user.model';
import { Video } from '../models/video.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/me`);
  }

  updateMe(changes: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.base}/me`, changes);
  }

  getHistory(page = 1): Observable<WatchHistoryEntry[]> {
    return this.http.get<WatchHistoryEntry[]>(`${this.base}/me/history`, { params: { page } });
  }

  removeHistoryEntry(videoId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/me/history/${videoId}`);
  }

  clearHistory(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/me/history`);
  }

  getLikedVideos(page = 1): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.base}/me/likes`, { params: { page } });
  }
}
