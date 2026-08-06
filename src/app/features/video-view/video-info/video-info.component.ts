// features/video-view/video-info/video-info.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../../core/models/video.model';

@Component({
  selector: 'app-video-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-info.component.html',
  styleUrls: ['./video-info.component.scss'],
})
export class VideoInfoComponent {
  @Input() video!: Video;
  expanded = false;

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
