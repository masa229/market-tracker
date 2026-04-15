package app.equityinsight.watchlist;

import app.equityinsight.watchlist.dto.CreateWatchlistDto;
import app.equityinsight.watchlist.dto.UpdateWatchlistDto;
import app.equityinsight.watchlist.dto.WatchlistDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watchlists")
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
    @ResponseStatus(HttpStatus.CREATED)
    public WatchlistDto createWatchlist(@Valid @RequestBody CreateWatchlistDto dto) {
        return watchlistService.createWatchlist(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWatchlist(@PathVariable Long id) {
        watchlistService.deleteWatchlist(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public WatchlistDto updateTitle(@PathVariable Long id, @Valid @RequestBody UpdateWatchlistDto dto) {
        return watchlistService.updateTitle(id, dto);
    }
}