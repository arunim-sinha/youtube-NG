// features/user-profile/history-tab/history-tab.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WatchHistoryEntry } from '../../../core/Models/user.model';
import { UserService } from '../../../core/Services/user.service';

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
  error = '';
  clearing = false;
  confirmClear = false;
  removing = new Set<string>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.userService.getHistory().subscribe({
      next: (entries) => {
        this.entries = entries;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Watch history could not be loaded.';
      },
    });
  }

  remove(entry: WatchHistoryEntry): void {
    this.error = '';
    this.removing.add(entry._id);
    this.userService.removeHistoryEntry(entry.video._id).subscribe({
      next: () => {
        this.entries = this.entries.filter((e) => e._id !== entry._id);
        this.removing.delete(entry._id);
      },
      error: () => {
        this.error = 'This item could not be removed from your history.';
        this.removing.delete(entry._id);
      },
    });
  }

  clearAll(): void {
    if (!this.confirmClear) {
      this.confirmClear = true;
      return;
    }
    this.clearing = true;
    this.error = '';
    this.userService.clearHistory().subscribe({
      next: () => {
        this.entries = [];
        this.clearing = false;
        this.confirmClear = false;
      },
      error: () => {
        this.error = 'Your history could not be cleared.';
        this.clearing = false;
      },
    });
  }

  cancelClear(): void {
    this.confirmClear = false;
  }
}
