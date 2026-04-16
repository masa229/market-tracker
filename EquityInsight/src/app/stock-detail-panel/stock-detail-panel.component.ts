import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockSummaryDto } from '../models/stock.models';

@Component({
  selector: 'app-stock-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-detail-panel.component.html',
  styleUrl: './stock-detail-panel.component.css'
})
export class StockDetailPanelComponent implements OnChanges {
  @Input() selectedWatchlistId: number | null = null;
  @Output() stockSelected = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWatchlistId']) {
      this.loadStocksForWatchlist();
    }
  }

  loadStocksForWatchlist(): void {}
}
