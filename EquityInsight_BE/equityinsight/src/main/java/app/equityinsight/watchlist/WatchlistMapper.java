package app.equityinsight.watchlist;

import app.equityinsight.stock.dto.StockSummaryDto;
import app.equityinsight.watchlist.dto.WatchlistDto;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class WatchlistMapper {

    public StockSummaryDto toStockSummaryDto(app.equityinsight.stock.Stock stock) {
        return new StockSummaryDto(stock.getId(), stock.getTickerSymbol());
    }

    public WatchlistDto toDto(Watchlist watchlist) {
        Set<StockSummaryDto> stocks = watchlist.getStocks().stream()
                .map(this::toStockSummaryDto)
                .collect(Collectors.toSet());

        return new WatchlistDto(
                watchlist.getId(),
                watchlist.getTitle(),
                stocks
        );
    }
}
