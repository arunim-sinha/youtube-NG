// features/video-view/video-view.component.ts
// Container for the View Page: composes player, info, creator info, engagement and comments.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { Video } from '../../core/Models/video.model';
import { VideoService } from '../../core/Services/video.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoInfoComponent } from './video-info/video-info.component';
import { CreatorInfoComponent } from './creator-info/creator-info.component';
import { EngagementBarComponent } from './engagement-bar/engagement-bar.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { RelatedVideosComponent } from '../video-listing/related-videos/related-videos.component';

@Component({
  selector: 'app-video-view',
  standalone: true,
  imports: [
    CommonModule,
    VideoPlayerComponent,
    VideoInfoComponent,
    CreatorInfoComponent,
    EngagementBarComponent,
    CommentSectionComponent,
    RelatedVideosComponent,
  ],
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss'],
})
export class VideoViewComponent implements OnInit, OnDestroy {
  video: Video | null = null;
  loading = true;
  error = '';
  notice = '';
  private routeSub?: Subscription;
  private viewLogged = false;

  constructor(private route: ActivatedRoute, private videoService: VideoService) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.viewLogged = false;
          this.video = null;
          this.error = '';
          this.notice = '';
          const id = params.get('id');
          if (!id) {
            this.error = 'This video could not be found or is unavailable.';
            return of(null);
          }
          return this.videoService.getById(id).pipe(
            catchError(() => {
              this.error = 'This video could not be found or is unavailable.';
              return of(null);
            })
          );
        })
      )
      .subscribe((video) => {
        this.video = video;
        this.loading = false;
      });
  }

  // Called by video-player once playback actually starts, so a page load without
  // playing doesn't inflate the view count.
  onPlaybackStarted(): void {
    if (this.viewLogged || !this.video) return;
    this.viewLogged = true;
    const videoId = this.video._id;
    this.videoService.registerView(videoId).subscribe({
      next: (res) => {
        if (this.video?._id === videoId) this.video.views = res.views;
      },
      error: () => {
        this.notice = 'Your view could not be recorded. Playback will continue normally.';
      },
    });
  }

  retry(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading = true;
    this.error = '';
    this.videoService.getById(id).subscribe({
      next: (video) => {
        this.video = video;
        this.loading = false;
      },
      error: () => {
        this.error = 'This video could not be found or is unavailable.';
        this.loading = false;
      },
    });
  }

  onReactionChanged(video: Video): void {
    this.video = video;
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
