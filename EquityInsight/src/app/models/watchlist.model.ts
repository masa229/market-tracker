export interface StockSummary {
  id: number;
  tickerSymbol: string;
}

export interface Watchlist {
  id: number;
  title: string;
  stocks: StockSummary[];
}

export interface CreateWatchlistDto {
  title: string;
}
