package app.equityinsight.watchlist;

import app.equityinsight.watchlist.dto.WatchlistDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final WatchlistMapper watchlistMapper;

    public WatchlistService(WatchlistRepository watchlistRepository, WatchlistMapper watchlistMapper) {
        this.watchlistRepository = watchlistRepository;
        this.watchlistMapper = watchlistMapper;
    }

    public List<WatchlistDto> getAllWatchlists() {
        return watchlistRepository.findAll().stream().map(watchlistMapper::toDto).toList();
    }
}
