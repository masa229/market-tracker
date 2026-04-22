package app.equityinsight.watchlist;

import app.equityinsight.stock.dto.StockSummaryDto;
import app.equityinsight.watchlist.dto.CreateWatchlistDto;
import app.equityinsight.watchlist.dto.UpdateWatchlistDto;
import app.equityinsight.watchlist.dto.WatchlistDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watchlists")
@Tag(name = "Watchlists", description = "Watchlist management endpoints")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    @Operation(summary = "Get all watchlists")
    public List<WatchlistDto> getAllWatchlists() {
        return watchlistService.getAllWatchlists();
    }

    @GetMapping("/{id}/stocks")
    @Operation(summary = "Get stocks in a watchlist")
    public List<StockSummaryDto> getStocksByWatchlistId(@PathVariable Long id) {
        return watchlistService.getStocksByWatchlistId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a watchlist")
    public WatchlistDto createWatchlist(@Valid @RequestBody CreateWatchlistDto dto) {
        return watchlistService.createWatchlist(dto);
    }

    @PostMapping("/{id}/stocks")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a stock to a watchlist")
    public StockSummaryDto addStockToWatchlist(
            @PathVariable Long id,
            @Parameter(description = "Ticker symbol, 1 to 4 letters or numbers")
            @RequestParam String ticker
    ) {
        return watchlistService.addStockToWatchlist(id, ticker);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a watchlist")
    public ResponseEntity<Void> deleteWatchlist(@PathVariable Long id) {
        watchlistService.deleteWatchlist(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{watchlistId}/stocks/{stockId}")
    @Operation(summary = "Remove a stock from a watchlist")
    public ResponseEntity<Void> removeStockFromWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long stockId
    ) {
        watchlistService.removeStockFromWatchlist(watchlistId, stockId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a watchlist title")
    public WatchlistDto updateTitle(@PathVariable Long id, @Valid @RequestBody UpdateWatchlistDto dto) {
        return watchlistService.updateTitle(id, dto);
    }
}
