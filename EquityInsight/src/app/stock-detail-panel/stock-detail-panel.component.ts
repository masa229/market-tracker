import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import {StockSummaryDto} from '../models/stock.models';
import { StockService } from '../services/stock.service';
import {Observable, observable} from 'rxjs';

@Component({
  selector: 'app-stock-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-detail-panel.component.html',
  styleUrl: './stock-detail-panel.component.css'
})
export class StockDetailPanelComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() selectedWatchlistId: number | null = null;
  @Output() stockSelected = new EventEmitter<number>();

  @ViewChild('chartRef', { static: true }) chartRef!: ElementRef<HTMLDivElement>;

  private stockService = inject(StockService);

  stocks: StockSummaryDto[] = [];
  selectedStockId: number | null = null;
  tickerInput = '';

  private chart: echarts.ECharts | null = null;

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWatchlistId'] && this.selectedWatchlistId) {
      this.loadStocksForWatchlist(this.selectedWatchlistId);
    }
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }

  loadStocksForWatchlist(watchlistId: number): void {
    this.stockService.getStocksByWatchlistId(watchlistId);
  }

  selectStock(stockId: number): void {
    this.selectedStockId = stockId;
    this.stockSelected.emit(stockId);
  }

  addStock(): void {
    const ticker = this.tickerInput.trim();
    if (!ticker) return;

    const observable1 = this.stockService.registerTicker(ticker);
    console.log(observable1, "TESTEST")
  }

  removeStock(id: number): void {

  }
}
