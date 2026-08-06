import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private base = `${environment.apiUrl}/playlists`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.base}/${id}`);
  }

  create(title: string, visibility: 'public' | 'private' = 'private'): Observable<Playlist> {
    return this.http.post<Playlist>(this.base, { title, visibility });
  }

  addVideo(playlistId: string, videoId: string): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.base}/${playlistId}/videos`, { videoId });
  }
}
