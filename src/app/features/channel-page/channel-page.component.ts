import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { Video } from '../../core/models/video.model';
import { VideoService } from '../../core/services/video.service';
import { VideoListManageComponent } from './video-list-manage/video-list-manage.component';

@Component({
  selector: 'app-channel-page',
  standalone: true,
  imports: [CommonModule, RouterModule, VideoListManageComponent],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit, OnDestroy {
  channelId = '';
  videos: Video[] = [];
  loading = true;
  error = '';
  isStudio = false;
  private routeSub?: Subscription;

  constructor(private route: ActivatedRoute, private videoService: VideoService) {}

  ngOnInit(): void {
    this.isStudio = this.route.snapshot.routeConfig?.path === 'studio/:id';
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.channelId = params.get('id') ?? '';
          this.loading = true;
          this.error = '';
          return this.videoService.getChannelVideos(this.channelId).pipe(
            catchError(() => of(null))
          );
        })
      )
      .subscribe((videos) => {
        this.loading = false;
        if (videos === null) {
          this.error = this.isStudio
            ? 'Your videos could not be loaded.'
            : 'This channel could not be loaded.';
          this.videos = [];
          return;
        }
        this.videos = videos;
      });
  }

  retry(): void {
    if (!this.channelId) return;
    this.loading = true;
    this.error = '';
    this.videoService.getChannelVideos(this.channelId).subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => {
        this.error = this.isStudio
          ? 'Your videos could not be loaded.'
          : 'This channel could not be loaded.';
        this.loading = false;
      },
    });
  }

  onVideosChanged(videos: Video[]): void {
    this.videos = videos;
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
