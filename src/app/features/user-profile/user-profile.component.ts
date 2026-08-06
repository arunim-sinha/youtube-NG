// features/user-profile/user-profile.component.ts
// Container: tab switcher for History / Likes / General Information.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryTabComponent } from './history-tab/history-tab.component';
import { LikesTabComponent } from './likes-tab/likes-tab.component';
import { GeneralInfoTabComponent } from './general-info-tab/general-info-tab.component';

type ProfileTab = 'history' | 'likes' | 'general';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HistoryTabComponent, LikesTabComponent, GeneralInfoTabComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  activeTab: ProfileTab = 'general';

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
  }
}
