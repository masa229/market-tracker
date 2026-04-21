import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentDto, CreateCommentDto, UpdateCommentDto } from '../models/comment.models';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent implements OnChanges {
  @Input() selectedStockId: number | null = null;

  private readonly commentService = inject(CommentService);

  comments: CommentDto[] = [];
  newCommentContent = '';
  editingCommentId: number | null = null;
  editedContent = '';
  isSubmitting = false;
  errorMessage = '';
  private commentsRequestVersion = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['selectedStockId']) {
      return;
    }

    this.commentsRequestVersion += 1;
    this.resetEditState();
    this.newCommentContent = '';
    this.errorMessage = '';
    this.isSubmitting = false;

    if (this.selectedStockId === null) {
      this.comments = [];
      return;
    }

    this.loadComments();
  }

  startEdit(id: number, content: string): void {
    this.editingCommentId = id;
    this.editedContent = content;
  }

  cancelEdit(): void {
    this.resetEditState();
  }

  createComment(): void {
    if (this.selectedStockId === null) {
      return;
    }

    const content = this.newCommentContent.trim();
    if (!content) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const requestStockId = this.selectedStockId;
    const requestVersion = this.commentsRequestVersion;

    const dto: CreateCommentDto = {
      content,
      stockId: requestStockId
    };

    this.commentService.createComment(dto).subscribe({
      next: comment => {
        if (requestStockId !== this.selectedStockId || requestVersion !== this.commentsRequestVersion) {
          return;
        }

        this.comments = this.sortComments([comment, ...this.comments]);
        this.newCommentContent = '';
        this.isSubmitting = false;
      },
      error: error => {
        if (requestStockId !== this.selectedStockId || requestVersion !== this.commentsRequestVersion) {
          return;
        }

        console.error('Failed to create comment', error);
        this.errorMessage = 'Add failed.';
        this.isSubmitting = false;
      }
    });
  }

  saveEdit(id: number): void {
    const content = this.editedContent.trim();
    if (!content) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const requestStockId = this.selectedStockId;
    const requestVersion = this.commentsRequestVersion;

    const dto: UpdateCommentDto = { content };

    this.commentService.updateComment(id, dto).subscribe({
      next: updatedComment => {
        if (requestStockId !== this.selectedStockId || requestVersion !== this.commentsRequestVersion) {
          return;
        }

        this.comments = this.sortComments(
          this.comments.map(comment =>
            comment.id === id ? updatedComment : comment
          )
        );
        this.resetEditState();
        this.isSubmitting = false;
      },
      error: error => {
        if (requestStockId !== this.selectedStockId || requestVersion !== this.commentsRequestVersion) {
          return;
        }

        console.error('Failed to update comment', error);
        this.errorMessage = 'Save failed.';
        this.isSubmitting = false;
      }
    });
  }

  deleteComment(id: number): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    const requestStockId = this.selectedStockId;
    const requestVersion = this.commentsRequestVersion;

    this.commentService.deleteComment(id).subscribe({
      next: () => {
        if (requestStockId !== this.selectedStockId || requestVersion !== this.commentsRequestVersion) {
          return;
        }

        this.comments = this.comments.filter(comment => comment.id !== id);

        if (this.editingCommentId === id) {
          this.resetEditState();
        }

        this.isSubmitting = false;
      },
      error: error => {
        if (requestStockId !== this.selectedStockId || requestVersion !== this.commentsRequestVersion) {
          return;
        }

        console.error('Failed to delete comment', error);
        this.errorMessage = 'Delete failed.';
        this.isSubmitting = false;
      }
    });
  }

  private loadComments(): void {
    if (this.selectedStockId === null) {
      return;
    }

    this.errorMessage = '';
    const requestVersion = this.commentsRequestVersion;

    this.commentService.getCommentsByStockId(this.selectedStockId).subscribe({
      next: comments => {
        if (requestVersion !== this.commentsRequestVersion) {
          return;
        }

        this.comments = this.sortComments(comments);
      },
      error: error => {
        if (requestVersion !== this.commentsRequestVersion) {
          return;
        }

        console.error('Failed to load comments', error);
        this.errorMessage = 'Load failed.';
        this.comments = [];
      }
    });
  }

  private resetEditState(): void {
    this.editingCommentId = null;
    this.editedContent = '';
  }

  private sortComments(comments: CommentDto[]): CommentDto[] {
    return [...comments].sort(
      (left, right) =>
        new Date(right.creationDate).getTime() - new Date(left.creationDate).getTime()
    );
  }
}
