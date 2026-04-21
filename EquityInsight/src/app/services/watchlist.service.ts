import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  WatchlistDto,
  CreateWatchlistDto,
  UpdateWatchlistDto
} from '../models/watchlist.models';
import { StockSummaryDto } from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/watchlists`;

  getAllWatchlists(): Observable<WatchlistDto[]> {
    return this.http.get<WatchlistDto[]>(this.baseUrl);
  }

  createWatchlist(dto: CreateWatchlistDto): Observable<WatchlistDto> {
    return this.http.post<WatchlistDto>(this.baseUrl, dto);
  }

  updateWatchlistTitle(id: number, dto: UpdateWatchlistDto): Observable<WatchlistDto> {
    return this.http.patch<WatchlistDto>(`${this.baseUrl}/${id}`, dto);
  }

  deleteWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getStocksByWatchlistId(watchlistId: number): Observable<StockSummaryDto[]> {
    return this.http.get<StockSummaryDto[]>(`${this.baseUrl}/${watchlistId}/stocks`);
  }

  addStockToWatchlist(watchlistId: number, ticker: string): Observable<StockSummaryDto> {
    return this.http.post<StockSummaryDto>(
      `${this.baseUrl}/${watchlistId}/stocks?ticker=${encodeURIComponent(ticker)}`,
      {}
    );
  }

  removeStockFromWatchlist(watchlistId: number, stockId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${watchlistId}/stocks/${stockId}`);
  }
}
