// features/video-listing/recommendations/recommendations.component.ts
// Reusable recommendations rail (e.g. for embedding on other pages / profile page).
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Video } from '../../../core/models/video.model';
import { VideoService } from '../../../core/services/video.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent implements OnInit {
  @Input() limit = 12;
  videos: Video[] = [];
  loading = true;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getRecommendations(this.limit).subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
