import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistPanelComponent } from '../watchlist-panel/watchlist-panel.component';
import { StockDetailPanelComponent } from '../stock-detail-panel/stock-detail-panel.component';
import { CommentPanelComponent } from '../comment-panel/comment-panel.component';
import { WatchlistDto } from '../models/watchlist.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    WatchlistPanelComponent,
    StockDetailPanelComponent,
    CommentPanelComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedWatchlist: WatchlistDto | null = null;
  selectedStockId: number | null = null;
  watchlistRefreshVersion = 0;

  onWatchlistSelected(watchlist: WatchlistDto | null): void {
    const previousWatchlistId = this.selectedWatchlist?.id ?? null;
    const nextWatchlistId = watchlist?.id ?? null;

    this.selectedWatchlist = watchlist;

    if (previousWatchlistId !== nextWatchlistId) {
      this.selectedStockId = null;
    }
  }

  onStockSelected(stockId: number | null): void {
    this.selectedStockId = stockId;
  }

  onWatchlistStocksChanged(): void {
    this.watchlistRefreshVersion += 1;
  }
}
