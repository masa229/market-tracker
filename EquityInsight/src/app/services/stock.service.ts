import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  StockDto,
  StockSummaryDto,
  StockPriceHistoryDto
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stocks`;

  getStockById(id: number): Observable<StockDto> {
    return this.http.get<StockDto>(`${this.baseUrl}/${id}`);
  }

  getStocksByWatchlistId(watchlistId: number): Observable<StockSummaryDto[]> {
    return this.http.get<StockSummaryDto[]>(`${this.baseUrl}/watchlist/${watchlistId}`);
  }

  registerTicker(ticker: string): Observable<StockDto> {
    return this.http.post<StockDto>(
      `${this.baseUrl}/register?ticker=${encodeURIComponent(ticker)}`,
      {}
    );
  }

  getPriceHistory(ticker: string, range: string): Observable<StockPriceHistoryDto> {
    return this.http.get<StockPriceHistoryDto>(
      `${this.baseUrl}/${encodeURIComponent(ticker)}/prices?range=${encodeURIComponent(range)}`
    );
  }
}
