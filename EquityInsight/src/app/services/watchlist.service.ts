import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  WatchlistDto,
  CreateWatchlistDto,
  UpdateWatchlistDto
} from '../models/watchlist.models';

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
}
