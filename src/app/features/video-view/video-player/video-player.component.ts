// features/video-view/video-player/video-player.component.ts
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../../core/models/video.model';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent {
  @Input() video!: Video;
  // Emits once, the first time playback actually begins (used to log a view).
  @Output() playbackStarted = new EventEmitter<void>();

  @ViewChild('player') playerRef?: ElementRef<HTMLVideoElement>;
  private started = false;

  onPlay(): void {
    if (this.started) return;
    this.started = true;
    this.playbackStarted.emit();
  }
}
