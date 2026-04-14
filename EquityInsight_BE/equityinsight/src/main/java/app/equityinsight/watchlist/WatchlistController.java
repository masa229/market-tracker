package app.equityinsight.watchlist;

import app.equityinsight.watchlist.dto.WatchlistDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public List<WatchlistDto> getAllWatchlists() {
        return watchlistService.getAllWatchlists();
    }

    @PostMapping
    public WatchlistDto createWatchlist() {

    }
}
