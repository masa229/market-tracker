package app.equityinsight.stock.dto;

import java.util.List;

public record StockPriceHistoryDto(
        String tickerSymbol,
        String range,
        List<PricePointDto> prices
) {
}