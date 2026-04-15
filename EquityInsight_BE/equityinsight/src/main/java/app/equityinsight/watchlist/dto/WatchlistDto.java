package app.equityinsight.watchlist.dto;

import app.equityinsight.stock.dto.StockSummaryDto;

import java.util.Set;

public record WatchlistDto(
        Long id,
        String title,
        Set<StockSummaryDto> stocks
) {
}
