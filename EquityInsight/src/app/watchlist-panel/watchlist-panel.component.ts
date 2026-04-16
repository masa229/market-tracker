import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchlistDto } from '../models/watchlist.models';

@Component({
  selector: 'app-watchlist-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.css'
})
export class WatchlistPanelComponent {
  @Output() watchlistSelected = new EventEmitter<number>();

  watchlists: WatchlistDto[] = [];

  selectedWatchlistId: number | null = null;
  newTitle = '';
  editingWatchlistId: number | null = null;
  editedTitle = '';

  selectWatchlist(id: number): void {
  }

  startEdit(watchlist: WatchlistDto): void {
    this.editingWatchlistId = watchlist.id;
    this.editedTitle = watchlist.title;
  }

  cancelEdit(): void {
    this.editingWatchlistId = null;
    this.editedTitle = '';
  }

  createWatchlist(): void {

  }

  saveEdit(watchlistId: number): void {
  }

  deleteWatchlist(watchlistId: number): void {
  }
}
