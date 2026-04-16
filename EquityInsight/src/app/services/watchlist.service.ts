import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Watchlist, CreateWatchlistDto } from '../models/watchlist.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/watchlists';

  getAllWatchlists(): Observable<Watchlist[]> {
    return this.http.get<Watchlist[]>(this.apiUrl);
  }

  createWatchlist(dto: CreateWatchlistDto): Observable<Watchlist> {
    return this.http.post<Watchlist>(this.apiUrl, dto);
  }

  updateWatchlistTitle(id: number, title: string): Observable<Watchlist> {
    return this.http.patch<Watchlist>(`${this.apiUrl}/${id}`, { title });
  }

  deleteWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
