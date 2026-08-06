// features/channel-page/upload-section/upload-section.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Video } from '../../../core/models/video.model';
import { VideoService } from '../../../core/services/video.service';

@Component({
  selector: 'app-upload-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-section.component.html',
  styleUrls: ['./upload-section.component.scss'],
})
export class UploadSectionComponent {
  @Output() uploaded = new EventEmitter<Video>();

  title = '';
  description = '';
  category = 'General';
  tags = '';
  visibility: 'public' | 'private' | 'unlisted' = 'public';

  videoFile: File | null = null;
  thumbnailFile: File | null = null;

  uploading = false;
  progress = 0;
  error = '';

  constructor(private videoService: VideoService) {}

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.videoFile = input.files?.[0] || null;
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.thumbnailFile = input.files?.[0] || null;
  }

  submit(): void {
    if (!this.videoFile || !this.title.trim()) {
      this.error = 'A title and video file are required.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title.trim());
    formData.append('description', this.description);
    formData.append('category', this.category);
    formData.append('tags', this.tags);
    formData.append('visibility', this.visibility);
    formData.append('video', this.videoFile);
    if (this.thumbnailFile) formData.append('thumbnail', this.thumbnailFile);

    this.uploading = true;
    this.error = '';

    this.videoService.upload(formData).subscribe({
      next: (video) => {
        this.uploaded.emit(video);
        this.resetForm();
        this.uploading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Upload failed. Please try again.';
        this.uploading = false;
      },
    });
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.category = 'General';
    this.tags = '';
    this.visibility = 'public';
    this.videoFile = null;
    this.thumbnailFile = null;
  }
}
