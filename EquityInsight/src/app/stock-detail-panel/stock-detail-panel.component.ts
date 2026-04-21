import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineChart } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import {
  ECharts,
  EChartsCoreOption,
  init as initChart,
  use
} from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { StockPriceHistoryDto } from '../models/stock.models';
import { WatchlistDto } from '../models/watchlist.models';
import { StockService } from '../services/stock.service';
import { WatchlistService } from '../services/watchlist.service';

type StockRange = '1M' | '3M' | '6M' | '1Y';

use([LineChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-stock-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-detail-panel.component.html',
  styleUrl: './stock-detail-panel.component.css'
})
export class StockDetailPanelComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() selectedWatchlist: WatchlistDto | null = null;
  @Input() selectedStockId: number | null = null;
  @Output() stockSelected = new EventEmitter<number | null>();
  @Output() watchlistStocksChanged = new EventEmitter<void>();

  @ViewChild('chartRef', { static: true }) chartRef!: ElementRef<HTMLDivElement>;

  private readonly stockService = inject(StockService);
  private readonly watchlistService = inject(WatchlistService);

  readonly supportedRanges: readonly StockRange[] = ['1M', '3M', '6M', '1Y'];

  selectedRange: StockRange = '1M';
  tickerInput = '';
  isMutatingStocks = false;
  stockActionErrorMessage = '';
  isChartLoading = false;
  chartErrorMessage = '';

  private chart: ECharts | null = null;
  private chartRequestVersion = 0;

  get selectedStock() {
    return this.selectedWatchlist?.stocks.find(stock => stock.id === this.selectedStockId) ?? null;
  }

  get isTickerInputValid(): boolean {
    return /^[A-Z0-9]{1,4}$/.test(this.tickerInput);
  }

  ngAfterViewInit(): void {
    this.chart = initChart(this.chartRef.nativeElement);
    this.syncChartState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedWatchlist']) {
      this.tickerInput = '';
      this.stockActionErrorMessage = '';
    }

    if (changes['selectedWatchlist'] || changes['selectedStockId']) {
      this.syncChartState();
    }
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.chart?.resize();
  }

  addStock(): void {
    if (!this.selectedWatchlist || !this.isTickerInputValid) {
      return;
    }

    this.isMutatingStocks = true;
    this.stockActionErrorMessage = '';

    this.watchlistService.addStockToWatchlist(this.selectedWatchlist.id, this.tickerInput).subscribe({
      next: addedStock => {
        this.tickerInput = '';
        this.stockSelected.emit(addedStock.id);
        this.watchlistStocksChanged.emit();
        this.isMutatingStocks = false;
      },
      error: error => {
        console.error('Failed to add stock to watchlist', error);
        this.stockActionErrorMessage = 'Add failed.';
        this.isMutatingStocks = false;
      }
    });
  }

  changeRange(range: StockRange): void {
    if (this.selectedRange === range) {
      return;
    }

    this.selectedRange = range;
    this.loadChartData();
  }

  onTickerInputChange(value: string): void {
    this.tickerInput = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4);

    if (this.stockActionErrorMessage) {
      this.stockActionErrorMessage = '';
    }
  }

  private syncChartState(): void {
    if (!this.chart) {
      return;
    }

    if (!this.selectedWatchlist) {
      this.chartRequestVersion += 1;
      this.isChartLoading = false;
      this.chartErrorMessage = '';
      this.renderEmptyChart('');
      return;
    }

    if (!this.selectedStock) {
      this.chartRequestVersion += 1;
      this.isChartLoading = false;
      this.chartErrorMessage = '';
      this.renderEmptyChart('');
      return;
    }

    this.loadChartData();
  }

  private loadChartData(): void {
    if (!this.chart) {
      return;
    }

    if (!this.selectedStock) {
      this.renderEmptyChart('');
      return;
    }

    this.isChartLoading = true;
    this.chartErrorMessage = '';
    const requestVersion = ++this.chartRequestVersion;
    const selectedTicker = this.selectedStock.tickerSymbol;

    this.stockService.getPriceHistory(selectedTicker, this.selectedRange).subscribe({
      next: response => {
        if (requestVersion !== this.chartRequestVersion) {
          return;
        }

        this.isChartLoading = false;
        this.renderChart(response);
      },
      error: error => {
        if (requestVersion !== this.chartRequestVersion) {
          return;
        }

        console.error('Failed to load price history', error);
        this.isChartLoading = false;
        this.chartErrorMessage = 'Load failed.';
        this.renderEmptyChart(`${selectedTicker} unavailable`);
      }
    });
  }

  private renderChart(response: StockPriceHistoryDto): void {
    if (!this.chart) {
      return;
    }

    const xAxisData = response.prices.map(point =>
      new Date(point.date).toLocaleDateString()
    );

    const seriesData = response.prices.map(point => point.closePrice);

    const option: EChartsCoreOption = {
      title: {
        text: `${response.tickerSymbol} history`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: response.tickerSymbol,
          type: 'line',
          smooth: true,
          data: seriesData
        }
      ]
    };

    this.chart.setOption(option, true);
    this.chart.resize();
  }

  private renderEmptyChart(title: string): void {
    if (!this.chart) {
      return;
    }

    const option: EChartsCoreOption = {
      title: {
        text: title,
        left: 'center',
        top: 'center'
      },
      xAxis: {
        type: 'category',
        show: false,
        data: []
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: []
    };

    this.chart.setOption(option, true);
    this.chart.resize();
  }
}
