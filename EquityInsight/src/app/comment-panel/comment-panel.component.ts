import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // temporary mock list for UI skeleton only
  comments = [
    {
      id: 1,
      content: 'Interesting stock for long-term growth',
      creationDate: '2026-04-16T10:00:00',
      lastEditedDate: '2026-04-16T10:00:00'
    }
  ];

  startEdit(id: number, currentContent: string): void {
    this.editingCommentId = id;
    this.editedContent = currentContent;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedContent = '';
  }

  createComment(): void {
    // TODO
  }

  saveEdit(id: number): void {
    // TODO
  }

  deleteComment(id: number): void {
    // TODO
  }
}
