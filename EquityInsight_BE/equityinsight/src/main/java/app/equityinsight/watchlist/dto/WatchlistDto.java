package app.equityinsight.watchlist.dto;

import app.equityinsight.stock.Stock;

import java.util.List;

public record WatchlistDto(
        Long id,
        String title,
        List<Stock> stocks
) {
}
