import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockSummaryDto } from '../models/stock.models';
import {
  WatchlistDto,
  CreateWatchlistDto,
  UpdateWatchlistDto
} from '../models/watchlist.models';
import { WatchlistService } from '../services/watchlist.service';

@Component({
  selector: 'app-watchlist-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './watchlist-panel.component.html',
  styleUrl: './watchlist-panel.component.css'
})
export class WatchlistPanelComponent implements OnInit, OnChanges {
  @Input() reloadVersion = 0;
  @Input() selectedStockId: number | null = null;
  @Output() watchlistSelected = new EventEmitter<WatchlistDto | null>();
  @Output() stockSelected = new EventEmitter<number | null>();

  private readonly watchlistService = inject(WatchlistService);

  watchlists: WatchlistDto[] = [];
  selectedWatchlistId: number | null = null;
  removingStockId: number | null = null;

  newTitle = '';
  editingWatchlistId: number | null = null;
  editedTitle = '';

  errorMessage = '';

  ngOnInit(): void {
    this.loadWatchlists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadVersion'] && !changes['reloadVersion'].firstChange) {
      this.loadWatchlists();
    }
  }

  get selectedWatchlist(): WatchlistDto | null {
    return this.watchlists.find(watchlist => watchlist.id === this.selectedWatchlistId) ?? null;
  }

  loadWatchlists(): void {
    this.errorMessage = '';

    this.watchlistService.getAllWatchlists().subscribe({
      next: watchlists => {
        this.watchlists = watchlists.map(watchlist => this.sortWatchlistStocks(watchlist));

        if (this.selectedWatchlistId !== null) {
          const selectedWatchlist = this.selectedWatchlist;

          if (!selectedWatchlist) {
            this.selectedWatchlistId = null;
            this.watchlistSelected.emit(null);
            this.stockSelected.emit(null);
          } else {
            this.watchlistSelected.emit(selectedWatchlist);

            if (this.selectedStockId !== null && !selectedWatchlist.stocks.some(stock => stock.id === this.selectedStockId)) {
              this.stockSelected.emit(null);
            }
          }
        }
      },
      error: error => {
        console.error('Failed to load watchlists', error);
        this.errorMessage = 'Load failed.';
      }
    });
  }

  selectWatchlist(watchlist: WatchlistDto): void {
    const isSameWatchlist = this.selectedWatchlistId === watchlist.id;
    this.selectedWatchlistId = watchlist.id;
    this.watchlistSelected.emit(watchlist);

    if (!isSameWatchlist) {
      this.stockSelected.emit(null);
    }
  }

  selectStock(watchlist: WatchlistDto, stockId: number): void {
    if (this.selectedWatchlistId !== watchlist.id) {
      this.selectWatchlist(watchlist);
    }

    this.stockSelected.emit(stockId);
  }

  removeStock(watchlist: WatchlistDto, stockId: number): void {
    this.errorMessage = '';
    this.removingStockId = stockId;

    this.watchlistService.removeStockFromWatchlist(watchlist.id, stockId).subscribe({
      next: () => {
        const updatedWatchlist = this.sortWatchlistStocks({
          ...watchlist,
          stocks: watchlist.stocks.filter(stock => stock.id !== stockId)
        });

        this.watchlists = this.watchlists.map(item =>
          item.id === watchlist.id ? updatedWatchlist : item
        );

        if (this.selectedWatchlistId === watchlist.id) {
          this.watchlistSelected.emit(updatedWatchlist);
        }

        if (this.selectedStockId === stockId) {
          this.stockSelected.emit(null);
        }

        this.removingStockId = null;
      },
      error: error => {
        console.error('Failed to remove stock from watchlist', error);
        this.errorMessage = 'Remove failed.';
        this.removingStockId = null;
      }
    });
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
    if (!title) {
      return;
    }

    this.errorMessage = '';
    const dto: CreateWatchlistDto = { title };

    this.watchlistService.createWatchlist(dto).subscribe({
      next: createdWatchlist => {
        this.watchlists = [...this.watchlists, this.sortWatchlistStocks(createdWatchlist)];
        this.newTitle = '';
      },
      error: error => {
        console.error('Failed to create watchlist', error);
        this.errorMessage = 'Add failed.';
      }
    });
  }

  saveEdit(watchlistId: number): void {
    const title = this.editedTitle.trim();
    if (!title) {
      return;
    }

    this.errorMessage = '';
    const dto: UpdateWatchlistDto = { title };

    this.watchlistService.updateWatchlistTitle(watchlistId, dto).subscribe({
      next: updatedWatchlist => {
        const normalizedWatchlist = this.sortWatchlistStocks(updatedWatchlist);

        this.watchlists = this.watchlists.map(watchlist =>
          watchlist.id === watchlistId ? normalizedWatchlist : watchlist
        );

        if (this.selectedWatchlistId === watchlistId) {
          this.watchlistSelected.emit(normalizedWatchlist);
        }

        this.cancelEdit();
      },
      error: error => {
        console.error('Failed to update watchlist', error);
        this.errorMessage = 'Save failed.';
      }
    });
  }

  deleteWatchlist(watchlistId: number): void {
    this.errorMessage = '';
    this.watchlistService.deleteWatchlist(watchlistId).subscribe({
      next: () => {
        this.watchlists = this.watchlists.filter(watchlist => watchlist.id !== watchlistId);

        if (this.selectedWatchlistId === watchlistId) {
          this.selectedWatchlistId = null;
          this.watchlistSelected.emit(null);
          this.stockSelected.emit(null);
        }
      },
      error: error => {
        console.error('Failed to delete watchlist', error);
        this.errorMessage = 'Delete failed.';
      }
    });
  }

  private sortWatchlistStocks(watchlist: WatchlistDto): WatchlistDto {
    return {
      ...watchlist,
      stocks: [...watchlist.stocks].sort((left, right) =>
        left.tickerSymbol.localeCompare(right.tickerSymbol)
      )
    };
  }
}
