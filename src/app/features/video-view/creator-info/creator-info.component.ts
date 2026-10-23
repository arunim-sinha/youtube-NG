// features/video-view/creator-info/creator-info.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChannelRef } from '../../../core/Models/video.model';

@Component({
  selector: 'app-creator-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './creator-info.component.html',
  styleUrls: ['./creator-info.component.scss'],
})
export class CreatorInfoComponent {
  @Input() channel!: ChannelRef;
}
