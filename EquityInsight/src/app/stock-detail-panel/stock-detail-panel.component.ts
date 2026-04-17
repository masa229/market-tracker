import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
import { StockSummaryDto } from '../models/stock.models';

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

  stocks: StockSummaryDto[] = [];
  selectedStockId: number | null = null;
  tickerInput = '';

  private chart: echarts.ECharts | null = null;

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartRef.nativeElement);
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWatchlistId']) {
      this.loadStocksForWatchlist();
    }

    if (this.chart) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }

  loadStocksForWatchlist(): void {
    this.selectedStockId = null;

    this.stocks = [
      { id: 101, tickerSymbol: 'NVDA' },
      { id: 102, tickerSymbol: 'AAPL' },
      { id: 103, tickerSymbol: 'MSFT' }
    ];
  }

  selectStock(stockId: number): void {
    this.selectedStockId = stockId;
    this.stockSelected.emit(stockId);
    this.renderChart();
  }

  addStock(): void {
    // TODO
  }

  removeStock(id: number): void {
    // TODO
  }

  private renderChart(): void {
    if (!this.chart) return;

    const selectedTicker =
      this.stocks.find(stock => stock.id === this.selectedStockId)?.tickerSymbol ?? 'NVDA';

    const option: echarts.EChartsOption = {
      title: {
        text: `${selectedTicker} price history`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: selectedTicker,
          type: 'line',
          smooth: true,
          data: [120, 132, 128, 145, 150, 158]
        }
      ]
    };

    this.chart.setOption(option);
    this.chart.resize();
  }
}
