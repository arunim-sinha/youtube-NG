// features/user-profile/likes-tab/likes-tab.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Video } from '../../../core/models/video.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-likes-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './likes-tab.component.html',
  styleUrls: ['./likes-tab.component.scss'],
})
export class LikesTabComponent implements OnInit {
  videos: Video[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.userService.getLikedVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Liked videos could not be loaded.';
      },
    });
  }
}
