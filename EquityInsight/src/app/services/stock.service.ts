import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockPriceHistoryDto } from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stocks`;
  private readonly alphaVantageApiKeyHeader = 'X-Alpha-Vantage-Api-Key';

  getPriceHistory(
    ticker: string,
    range: string,
    alphaVantageApiKey?: string
  ): Observable<StockPriceHistoryDto> {
    const params = new HttpParams().set('range', range);
    const normalizedApiKey = alphaVantageApiKey?.trim();

    return this.http.get<StockPriceHistoryDto>(
      `${this.baseUrl}/${encodeURIComponent(ticker)}/prices`,
      {
        params,
        headers: normalizedApiKey
          ? new HttpHeaders().set(this.alphaVantageApiKeyHeader, normalizedApiKey)
          : undefined
      }
    );
  }
}
