import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  selectedStockId: number | null = null;
  tickerInput = '';

  // temporary mock list for UI skeleton only
  stocks = [
    { id: 101, tickerSymbol: 'NVDA' },
    { id: 102, tickerSymbol: 'AAPL' },
    { id: 103, tickerSymbol: 'MSFT' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWatchlistId']) {
      // TODO: later react to selected watchlist
    }
  }

  selectStock(id: number): void {
    this.selectedStockId = id;
    this.stockSelected.emit(id);
  }

  addStock(): void {
    // TODO
  }

  removeStock(id: number): void {
    // TODO
  }
}
