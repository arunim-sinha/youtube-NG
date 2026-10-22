// features/video-view/comment-section/comment-section.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/Services/AuthService/auth.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnChanges {
  @Input() videoId!: string;
  @Input() commentCount = 0;

  comments: Comment[] = [];
  loading = false;
  newCommentText = '';
  replyingTo: string | null = null;
  replyText = '';
  error = '';
  posting = false;

  constructor(private commentService: CommentService, private authService: AuthService) {}

  ngOnChanges(): void {
    if (this.videoId) this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.error = '';
    this.commentService.getComments(this.videoId).subscribe({
      next: (res) => {
        this.comments = res.comments;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Comments could not be loaded.';
      },
    });
  }

  postComment(): void {
    const text = this.newCommentText.trim();
    if (!text || this.posting) return;
    if (!this.authService.isLoggedIn()) {
      this.error = 'Sign in to join the conversation.';
      return;
    }
    this.posting = true;
    this.error = '';
    this.commentService.addComment(this.videoId, text).subscribe({
      next: (comment) => {
        this.comments = [{ ...comment, replies: [] }, ...this.comments];
        this.commentCount++;
        this.newCommentText = '';
        this.posting = false;
      },
      error: () => {
        this.error = 'Your comment could not be posted. Please try again.';
        this.posting = false;
      },
    });
  }

  startReply(commentId: string): void {
    this.replyingTo = commentId;
    this.replyText = '';
  }

  cancelReply(): void {
    this.replyingTo = null;
    this.replyText = '';
  }

  postReply(parent: Comment): void {
    const text = this.replyText.trim();
    if (!text || this.posting) return;
    if (!this.authService.isLoggedIn()) {
      this.error = 'Sign in to reply to a comment.';
      return;
    }
    this.posting = true;
    this.error = '';
    this.commentService.addComment(this.videoId, text, parent._id).subscribe({
      next: (reply) => {
        parent.replies = [...(parent.replies || []), reply];
        this.cancelReply();
        this.posting = false;
      },
      error: () => {
        this.error = 'Your reply could not be posted. Please try again.';
        this.posting = false;
      },
    });
  }

  deleteComment(comment: Comment, parent?: Comment): void {
    this.error = '';
    this.commentService.deleteComment(comment._id).subscribe({
      next: () => {
        if (parent) {
          parent.replies = (parent.replies || []).filter((r) => r._id !== comment._id);
        } else {
          this.comments = this.comments.filter((c) => c._id !== comment._id);
          this.commentCount--;
        }
      },
      error: () => {
        this.error = 'This comment could not be deleted.';
      },
    });
  }
}
