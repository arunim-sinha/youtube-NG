// features/channel-page/video-list-manage/video-list-manage.component.ts
// List of the channel owner's uploads with per-video hide/unhide (visibility) and delete controls.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Video } from '../../../core/models/video.model';
import { VideoService } from '../../../core/services/video.service';

@Component({
  selector: 'app-video-list-manage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-list-manage.component.html',
  styleUrls: ['./video-list-manage.component.scss'],
})
export class VideoListManageComponent {
  @Input() videos: Video[] = [];
  @Output() videosChanged = new EventEmitter<Video[]>();

  busyId: string | null = null;
  error = '';

  constructor(private videoService: VideoService) {}

  // Cycles public -> unlisted -> private -> public, giving a simple one-click
  // way to hide a video from public listing without deleting it.
  toggleVisibility(video: Video): void {
    const next = video.visibility === 'public' ? 'unlisted' : video.visibility === 'unlisted' ? 'private' : 'public';
    this.busyId = video._id;
    this.error = '';
    this.videoService.setVisibility(video._id, next).subscribe({
      next: (updated) => {
        this.videosChanged.emit(this.videos.map((v) => (v._id === updated._id ? updated : v)));
        this.busyId = null;
      },
      error: () => {
        this.error = 'Video visibility could not be updated.';
        this.busyId = null;
      },
    });
  }

  deleteVideo(video: Video): void {
    if (!confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
    this.busyId = video._id;
    this.error = '';
    this.videoService.delete(video._id).subscribe({
      next: () => {
        this.videosChanged.emit(this.videos.filter((v) => v._id !== video._id));
        this.busyId = null;
      },
      error: () => {
        this.error = 'This video could not be deleted.';
        this.busyId = null;
      },
    });
  }
}
