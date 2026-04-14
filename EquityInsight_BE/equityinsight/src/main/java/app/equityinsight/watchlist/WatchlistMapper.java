package app.equityinsight.watchlist;

import app.equityinsight.watchlist.dto.WatchlistDto;
import org.springframework.stereotype.Component;

@Component
public class WatchlistMapper {

    public WatchlistDto toDto(Watchlist watchlist) {
        return new WatchlistDto(
                watchlist.getId(),
                watchlist.getTitle(),
                watchlist.getStocks()
        );
    }
}
