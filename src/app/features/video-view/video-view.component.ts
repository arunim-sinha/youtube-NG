// features/video-view/video-view.component.ts
// Container for the View Page: composes player, info, creator info, engagement and comments.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Video } from '../../core/models/video.model';
import { VideoService } from '../../core/services/video.service';
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
  private routeSub?: Subscription;
  private viewLogged = false;

  constructor(private route: ActivatedRoute, private videoService: VideoService) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.viewLogged = false;
          return this.videoService.getById(params.get('id')!);
        })
      )
      .subscribe({
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

  // Called by video-player once playback actually starts, so a page load without
  // playing doesn't inflate the view count.
  onPlaybackStarted(): void {
    if (this.viewLogged || !this.video) return;
    this.viewLogged = true;
    this.videoService.registerView(this.video._id).subscribe((res) => {
      if (this.video) this.video.views = res.views;
    });
  }

  onReactionChanged(video: Video): void {
    this.video = video;
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
