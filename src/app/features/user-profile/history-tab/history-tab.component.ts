// features/user-profile/history-tab/history-tab.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WatchHistoryEntry } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.scss'],
})
export class HistoryTabComponent implements OnInit {
  entries: WatchHistoryEntry[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.userService.getHistory().subscribe({
      next: (entries) => {
        this.entries = entries;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  remove(entry: WatchHistoryEntry): void {
    this.userService.removeHistoryEntry(entry.video._id).subscribe(() => {
      this.entries = this.entries.filter((e) => e._id !== entry._id);
    });
  }

  clearAll(): void {
    this.userService.clearHistory().subscribe(() => (this.entries = []));
  }
}
