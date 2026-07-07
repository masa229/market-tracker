import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StockDetailPanelComponent } from './stock-detail-panel.component';
import { StockService } from '../services/stock.service';
import { WatchlistService } from '../services/watchlist.service';

describe('StockDetailPanelComponent', () => {
  let component: StockDetailPanelComponent;
  let fixture: ComponentFixture<StockDetailPanelComponent>;
  let stockServiceSpy: jasmine.SpyObj<StockService>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  beforeEach(async () => {
    stockServiceSpy = jasmine.createSpyObj<StockService>('StockService', ['getPriceHistory']);
    watchlistServiceSpy = jasmine.createSpyObj<WatchlistService>('WatchlistService', ['addStockToWatchlist']);
    stockServiceSpy.getPriceHistory.and.returnValue(of({ tickerSymbol: 'MSFT', range: '1M', prices: [] }));
    watchlistServiceSpy.addStockToWatchlist.and.returnValue(of({ id: 1, tickerSymbol: 'MSFT' }));

    await TestBed.configureTestingModule({
      imports: [StockDetailPanelComponent],
      providers: [
        { provide: StockService, useValue: stockServiceSpy },
        { provide: WatchlistService, useValue: watchlistServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the Alpha Vantage API key from the welcome screen input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#alpha-vantage-api-key');

    input.value = 'demo-key';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.alphaVantageApiKey).toBe('demo-key');
  });
});
