import { StockSummaryDto } from './stock.models';

export interface WatchlistDto {
  id: number;
  title: string;
  stocks: StockSummaryDto[];
}

export interface CreateWatchlistDto {
  title: string;
}

export interface UpdateWatchlistDto {
  title: string;
}
