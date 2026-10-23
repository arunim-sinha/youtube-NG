// features/video-listing/playlist-panel/playlist-panel.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Playlist } from '../../../core/Models/playlist.model';
import { PlaylistService } from '../../../core/Services/playlist.service';

@Component({
  selector: 'app-playlist-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './playlist-panel.component.html',
  styleUrls: ['./playlist-panel.component.scss'],
})
export class PlaylistPanelComponent implements OnChanges {
  @Input() playlistId!: string;
  @Input() activeVideoId?: string;
  playlist: Playlist | null = null;
  loading = false;

  constructor(private playlistService: PlaylistService) {}

  ngOnChanges(): void {
    if (!this.playlistId) return;
    this.loading = true;
    this.playlistService.getById(this.playlistId).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
