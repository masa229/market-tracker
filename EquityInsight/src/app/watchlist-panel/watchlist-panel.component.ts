import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchlistService } from '../services/watchlist.service';
import {
  WatchlistDto,
  CreateWatchlistDto,
  UpdateWatchlistDto
} from '../models/watchlist.models';

@Component({
  selector: 'app-watchlist-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.css'
})
export class WatchlistPanelComponent implements OnInit {
  @Output() watchlistSelected = new EventEmitter<number>();

  private watchlistService = inject(WatchlistService);

  watchlists: WatchlistDto[] = [];
  selectedWatchlistId: number | null = null;

  newTitle = '';
  editingWatchlistId: number | null = null;
  editedTitle = '';

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadWatchlists();
  }

  loadWatchlists(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.watchlistService.getAllWatchlists().subscribe({
      next: (watchlists) => {
        this.watchlists = watchlists;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load watchlists', error);
        this.errorMessage = 'Failed to load watchlists.';
        this.isLoading = false;
      }
    });
  }

  selectWatchlist(id: number): void {
    this.selectedWatchlistId = id;
    this.watchlistSelected.emit(id);
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
    const title = this.newTitle.trim();
    if (!title) return;

    const dto: CreateWatchlistDto = { title };

    this.watchlistService.createWatchlist(dto).subscribe({
      next: (createdWatchlist) => {
        this.watchlists = [...this.watchlists, createdWatchlist];
        this.newTitle = '';
      },
      error: (error) => {
        console.error('Failed to create watchlist', error);
        this.errorMessage = 'Failed to create watchlist.';
      }
    });
  }

  saveEdit(watchlistId: number): void {
    const title = this.editedTitle.trim();
    if (!title) return;

    const dto: UpdateWatchlistDto = { title };

    this.watchlistService.updateWatchlistTitle(watchlistId, dto).subscribe({
      next: (updatedWatchlist) => {
        this.watchlists = this.watchlists.map(w =>
          w.id === watchlistId ? updatedWatchlist : w
        );
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Failed to update watchlist', error);
        this.errorMessage = 'Failed to update watchlist.';
      }
    });
  }

  deleteWatchlist(watchlistId: number): void {
    this.watchlistService.deleteWatchlist(watchlistId).subscribe({
      next: () => {
        this.watchlists = this.watchlists.filter(w => w.id !== watchlistId);

        if (this.selectedWatchlistId === watchlistId) {
          this.selectedWatchlistId = null;
        }
      },
      error: (error) => {
        console.error('Failed to delete watchlist', error);
        this.errorMessage = 'Failed to delete watchlist.';
      }
    });
  }
}
