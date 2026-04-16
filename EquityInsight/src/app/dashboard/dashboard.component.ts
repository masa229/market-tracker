import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistPanelComponent } from '../watchlist-panel/watchlist-panel.component';
import { StockDetailPanelComponent } from '../stock-detail-panel/stock-detail-panel.component';
import { CommentPanelComponent } from '../comment-panel/comment-panel.component';

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
  selectedWatchlistId: number | null = null;
  selectedStockId: number | null = null;

  onWatchlistSelected(watchlistId: number): void {
    this.selectedWatchlistId = watchlistId;
    this.selectedStockId = null;
  }

  onStockSelected(stockId: number): void {
    this.selectedStockId = stockId;
  }
}
