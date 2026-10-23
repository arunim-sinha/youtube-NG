// features/video-listing/related-videos/related-videos.component.ts
// Sidebar list shown on the View Page.
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Video } from '../../../core/Models/video.model';
import { VideoService } from '../../../core/Services/video.service';

@Component({
  selector: 'app-related-videos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './related-videos.component.html',
  styleUrls: ['./related-videos.component.scss'],
})
export class RelatedVideosComponent implements OnChanges {
  @Input() videoId!: string;
  videos: Video[] = [];
  loading = false;
  error = '';

  constructor(private videoService: VideoService) {}

  ngOnChanges(): void {
    if (!this.videoId) return;
    this.loading = true;
    this.error = '';
    this.videoService.getRelated(this.videoId).subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Related videos could not be loaded.';
      },
    });
  }

  retry(): void {
    this.ngOnChanges();
  }
}
