// features/video-listing/video-listing.component.ts
// Home / listing page: grid of recommended videos.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Video } from '../../core/models/video.model';
import { VideoService } from '../../core/services/video.service';

@Component({
  selector: 'app-video-listing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-listing.component.html',
  styleUrls: ['./video-listing.component.scss'],
})
export class VideoListingComponent implements OnInit {
  videos: Video[] = [];
  loading = true;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getRecommendations().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
