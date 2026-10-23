// features/video-view/engagement-bar/engagement-bar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../../core/Models/video.model';
import { VideoService } from '../../../core/Services/video.service';
import { AuthService } from '../../../core/Services/AuthService/auth.service';

@Component({
  selector: 'app-engagement-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './engagement-bar.component.html',
  styleUrls: ['./engagement-bar.component.scss'],
})
export class EngagementBarComponent {
  @Input() video!: Video;
  @Output() reactionChanged = new EventEmitter<Video>();

  reacting = false;
  message = '';

  constructor(private videoService: VideoService, private authService: AuthService) {}

  react(type: 'like' | 'dislike'): void {
    if (this.reacting) return;
    if (!this.authService.isLoggedIn()) {
      this.message = 'Sign in to react to videos.';
      return;
    }
    this.reacting = true;
    this.message = '';

    const previous = this.video.myReaction ?? null;
    // optimistic update
    this.applyOptimistic(type, previous);

    this.videoService.react(this.video._id, type).subscribe({
      next: (res) => {
        this.video.myReaction = res.myReaction;
        this.reacting = false;
        this.reactionChanged.emit(this.video);
      },
      error: () => {
        this.applyOptimistic(previous, this.video.myReaction ?? null); // revert
        this.reacting = false;
        this.message = 'Your reaction could not be saved. Please try again.';
      },
    });
  }

  private applyOptimistic(next: 'like' | 'dislike' | null, previous: 'like' | 'dislike' | null): void {
    if (previous === 'like') this.video.likeCount--;
    if (previous === 'dislike') this.video.dislikeCount--;
    if (next === previous) {
      this.video.myReaction = null;
      return;
    }
    if (next === 'like') this.video.likeCount++;
    if (next === 'dislike') this.video.dislikeCount++;
    this.video.myReaction = next;
  }

  share(): void {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: this.video.title, url }).then(
        () => { this.message = 'Video shared.'; },
        () => { this.message = 'Sharing was cancelled or unavailable.'; }
      );
    } else {
      if (!navigator.clipboard) {
        this.message = 'Copy the page address to share this video.';
        return;
      }
      navigator.clipboard.writeText(url).then(
        () => { this.message = 'Link copied to clipboard.'; },
        () => { this.message = 'Could not copy the link. Copy the page address to share it.'; }
      );
    }
  }
}
