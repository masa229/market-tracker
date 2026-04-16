import { StockSummaryDto } from './stock.models';

export interface WatchlistDto {
  id: number;
  title: string;
  stocks: StockSummaryDto[];
}
