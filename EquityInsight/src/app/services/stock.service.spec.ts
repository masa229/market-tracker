import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StockService } from './stock.service';
import { environment } from '../../environments/environment';

describe('StockService', () => {
  let service: StockService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(StockService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('includes the Alpha Vantage API key header when provided', () => {
    service.getPriceHistory('MSFT', '1M', 'demo-key').subscribe();

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/stocks/MSFT/prices?range=1M`
    );

    expect(request.request.headers.get('X-Alpha-Vantage-Api-Key')).toBe('demo-key');
    request.flush({ tickerSymbol: 'MSFT', range: '1M', prices: [] });
  });

  it('omits the Alpha Vantage API key header when no key is provided', () => {
    service.getPriceHistory('MSFT', '1M').subscribe();

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/stocks/MSFT/prices?range=1M`
    );

    expect(request.request.headers.has('X-Alpha-Vantage-Api-Key')).toBeFalse();
    request.flush({ tickerSymbol: 'MSFT', range: '1M', prices: [] });
  });
});
