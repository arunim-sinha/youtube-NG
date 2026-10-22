// features/video-view/video-player/video-player.component.ts
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../../core/models/video.model';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnChanges {
  @Input() video!: Video;
  // Emits once, the first time playback actually begins (used to log a view).
  @Output() playbackStarted = new EventEmitter<void>();

  @ViewChild('player') playerRef?: ElementRef<HTMLVideoElement>;
  private started = false;
  playbackError = false;

  ngOnChanges(): void {
    this.started = false;
    this.playbackError = false;
  }

  onPlay(): void {
    this.playbackError = false;
    if (this.started) return;
    this.started = true;
    this.playbackStarted.emit();
  }

  onError(): void {
    this.playbackError = true;
  }
}
