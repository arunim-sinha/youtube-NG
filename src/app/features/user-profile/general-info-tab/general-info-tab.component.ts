// features/user-profile/general-info-tab/general-info-tab.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserProfile } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-general-info-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './general-info-tab.component.html',
  styleUrls: ['./general-info-tab.component.scss'],
})
export class GeneralInfoTabComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = true;
  saving = false;
  editing = false;
  draft: Partial<UserProfile> = {};
  error = '';
  success = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.userService.getMe().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Your profile could not be loaded.';
      },
    });
  }

  startEdit(): void {
    if (!this.profile) return;
    this.draft = { username: this.profile.username, bio: this.profile.bio, avatarUrl: this.profile.avatarUrl };
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  save(): void {
    if (!this.draft.username?.trim()) {
      this.error = 'Username is required.';
      return;
    }
    this.saving = true;
    this.error = '';
    this.success = '';
    this.userService.updateMe(this.draft).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.saving = false;
        this.editing = false;
        this.success = 'Your profile has been updated.';
      },
      error: () => {
        this.saving = false;
        this.error = 'Your changes could not be saved. Please try again.';
      },
    });
  }
}
