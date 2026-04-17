import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CommentItem {
  id: number;
  stockId: number;
  content: string;
  creationDate: string;
  lastEditedDate: string;
}

@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent {
  @Input() selectedStockId: number | null = null;

  newCommentContent = '';
  editingCommentId: number | null = null;
  editedContent = '';

  allComments: CommentItem[] = [
    {
      id: 1,
      stockId: 1,
      content: 'Interesting stock for long-term growth',
      creationDate: '2026-04-16T10:00:00',
      lastEditedDate: '2026-04-16T10:00:00'
    },
    {
      id: 2,
      stockId: 2,
      content: 'Looks volatile at the moment',
      creationDate: '2026-04-16T11:30:00',
      lastEditedDate: '2026-04-16T11:30:00'
    }
  ];

  get comments(): CommentItem[] {
    if (this.selectedStockId == null) {
      return [];
    }

    return this.allComments.filter(c => c.stockId === this.selectedStockId);
  }

  startEdit(id: number, content: string): void {
    this.editingCommentId = id;
    this.editedContent = content;
  }

  cancelEdit(): void {
    this.resetEditState();
  }

  createComment(): void {
    if (this.selectedStockId == null) {
      return;
    }

    const content = this.newCommentContent.trim();
    if (!content) {
      return;
    }

    const timestamp = new Date().toISOString();

    this.allComments.unshift({
      id: this.getNextId(),
      stockId: this.selectedStockId,
      content,
      creationDate: timestamp,
      lastEditedDate: timestamp
    });

    this.newCommentContent = '';
  }

  saveEdit(id: number): void {
    const content = this.editedContent.trim();
    if (!content) {
      return;
    }

    const comment = this.allComments.find(c => c.id === id);
    if (!comment) {
      return;
    }

    comment.content = content;
    comment.lastEditedDate = new Date().toISOString();

    this.resetEditState();
  }

  deleteComment(id: number): void {
    this.allComments = this.allComments.filter(c => c.id !== id);

    if (this.editingCommentId === id) {
      this.resetEditState();
    }
  }

  private resetEditState(): void {
    this.editingCommentId = null;
    this.editedContent = '';
  }

  private getNextId(): number {
    return this.allComments.length
      ? Math.max(...this.allComments.map(c => c.id)) + 1
      : 1;
  }
}
