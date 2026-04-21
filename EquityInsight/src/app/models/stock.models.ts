export interface StockSummaryDto {
  id: number;
  tickerSymbol: string;
}

export interface PricePointDto {
  date: string;
  closePrice: number;
}

export interface StockPriceHistoryDto {
  tickerSymbol: string;
  range: string;
  prices: PricePointDto[];
}
