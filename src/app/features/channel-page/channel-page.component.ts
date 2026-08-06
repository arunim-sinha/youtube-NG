// features/channel-page/channel-page.component.ts
// Channel owner view: upload new videos + manage (edit visibility / delete) existing ones.
// A read-only "public channel" view can reuse video-list-manage's list rendering minus the
// owner-only actions; kept together here since the spec calls for owner-facing management.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../core/models/video.model';
import { VideoService } from '../../core/services/video.service';
import { UploadSectionComponent } from './upload-section/upload-section.component';
import { VideoListManageComponent } from './video-list-manage/video-list-manage.component';

@Component({
  selector: 'app-channel-page',
  standalone: true,
  imports: [CommonModule, UploadSectionComponent, VideoListManageComponent],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit {
  channelId = '';
  videos: Video[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private videoService: VideoService) {}

  ngOnInit(): void {
    // Falls back to "me" — wire to an auth service's current-user id in the real app.
    this.channelId = this.route.snapshot.paramMap.get('id') || 'me';
    this.loadVideos();
  }

  loadVideos(): void {
    this.loading = true;
    this.videoService.getChannelVideos(this.channelId).subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onUploaded(video: Video): void {
    this.videos = [video, ...this.videos];
  }

  onVideosChanged(videos: Video[]): void {
    this.videos = videos;
  }
}
