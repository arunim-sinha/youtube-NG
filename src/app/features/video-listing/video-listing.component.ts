import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { Video } from '../../core/Models/video.model';
import { VideoService } from '../../core/Services/video.service';

@Component({
  selector: 'app-video-listing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-listing.component.html',
  styleUrls: ['./video-listing.component.scss'],
})
export class VideoListingComponent implements OnInit, OnDestroy {
  videos: Video[] = [];
  loading = true;
  error = '';
  query = '';
  selectedCategory = 'All';
  private routeSub?: Subscription;

  constructor(private videoService: VideoService, private route: ActivatedRoute) {}

  get categories(): string[] {
    return ['All', ...new Set(this.videos.map((video) => video.category).filter(Boolean))];
  }

  get visibleVideos(): Video[] {
    return this.selectedCategory === 'All'
      ? this.videos
      : this.videos.filter((video) => video.category === this.selectedCategory);
  }

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          this.query = params.get('q')?.trim() ?? '';
          this.selectedCategory = 'All';
          this.loading = true;
          this.error = '';
          return (this.query
            ? this.videoService.search(this.query)
            : this.videoService.getRecommendations(30)
          ).pipe(catchError(() => of(null)));
        })
      )
      .subscribe((videos) => {
        this.loading = false;
        if (videos === null) {
          this.error = 'We could not load videos right now. Check your connection and try again.';
          this.videos = [];
          return;
        }
        this.videos = videos;
      });
  }

  retry(): void {
    this.loading = true;
    this.error = '';
    const request = this.query
      ? this.videoService.search(this.query)
      : this.videoService.getRecommendations(30);
    request.subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => {
        this.error = 'We could not load videos right now. Check your connection and try again.';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
