package app.equityinsight.watchlist;

import app.equityinsight.exception.WatchlistNotFoundException;
import app.equityinsight.watchlist.dto.CreateWatchlistDto;
import app.equityinsight.watchlist.dto.WatchlistDto;
import jakarta.validation.Valid;
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

    public WatchlistDto createWatchlist(CreateWatchlistDto dto) {
        Watchlist watchlist = new Watchlist(dto.title());
        Watchlist safedWatchlist = watchlistRepository.save(watchlist);
        return watchlistMapper.toDto(safedWatchlist);
    }

    public void deleteWatchlist(Long id) {
        if (!watchlistRepository.existsById(id)) {
            throw new WatchlistNotFoundException(id);
        }
        watchlistRepository.deleteById(id);
    }
}
