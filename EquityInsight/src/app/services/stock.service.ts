import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockPriceHistoryDto } from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stocks`;

  getPriceHistory(ticker: string, range: string): Observable<StockPriceHistoryDto> {
    return this.http.get<StockPriceHistoryDto>(
      `${this.baseUrl}/${encodeURIComponent(ticker)}/prices?range=${encodeURIComponent(range)}`
    );
  }
}
