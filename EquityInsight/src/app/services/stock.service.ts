import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StockDto, StockPriceHistoryDto} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/stocks';

  getStockById(id: number): Observable<StockDto> {
    return this.http.get<StockDto>(`${this.baseUrl}/${id}`);
  }

  registerTicker(ticker: string): Observable<StockDto> {
    return this.http.post<StockDto>(`${this.baseUrl}/register?ticker=${ticker}`, {});
  }

  getPriceHistory(ticker: string, range: string): Observable<StockPriceHistoryDto> {
    return this.http.get<StockPriceHistoryDto>(`${this.baseUrl}/${ticker}/prices?range=${range}`);
  }
}
