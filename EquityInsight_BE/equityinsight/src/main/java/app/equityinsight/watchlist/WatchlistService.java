package app.equityinsight.watchlist;

import app.equityinsight.exception.StockNotFoundException;
import app.equityinsight.stock.Stock;
import app.equityinsight.stock.StockService;
import app.equityinsight.stock.dto.StockSummaryDto;
import app.equityinsight.exception.WatchlistNotFoundException;
import app.equityinsight.watchlist.dto.CreateWatchlistDto;
import app.equityinsight.watchlist.dto.UpdateWatchlistDto;
import app.equityinsight.watchlist.dto.WatchlistDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class WatchlistService {

    private static final Logger log = LoggerFactory.getLogger(WatchlistService.class);

    private final WatchlistRepository watchlistRepository;
    private final WatchlistMapper watchlistMapper;
    private final StockService stockService;

    public WatchlistService(
            WatchlistRepository watchlistRepository,
            WatchlistMapper watchlistMapper,
            StockService stockService
    ) {
        this.watchlistRepository = watchlistRepository;
        this.watchlistMapper = watchlistMapper;
        this.stockService = stockService;
    }

    public List<WatchlistDto> getAllWatchlists() {
        return watchlistRepository.findAll().stream()
                .map(watchlistMapper::toDto)
                .toList();
    }

    public List<StockSummaryDto> getStocksByWatchlistId(Long id) {
        Watchlist watchlist = getWatchlistById(id);

        return watchlist.getStocks().stream()
                .map(watchlistMapper::toStockSummaryDto)
                .toList();
    }

    @Transactional
    public WatchlistDto createWatchlist(CreateWatchlistDto dto) {
        Watchlist watchlist = new Watchlist(dto.title());
        Watchlist savedWatchlist = watchlistRepository.save(watchlist);
        return watchlistMapper.toDto(savedWatchlist);
    }

    @Transactional
    public void deleteWatchlist(Long id) {
        Watchlist watchlist = getWatchlistById(id);

        for (Stock stock : new HashSet<>(watchlist.getStocks())) {
            stock.removeWatchlist(watchlist);
        }

        watchlistRepository.delete(watchlist);
    }

    @Transactional
    public WatchlistDto updateTitle(Long id, UpdateWatchlistDto dto) {
        Watchlist watchlist = getWatchlistById(id);

        watchlist.setTitle(dto.title());
        Watchlist savedWatchlist = watchlistRepository.save(watchlist);
        return watchlistMapper.toDto(savedWatchlist);
    }

    @Transactional
    public StockSummaryDto addStockToWatchlist(Long watchlistId, String rawTicker) {
        Watchlist watchlist = getWatchlistById(watchlistId);
        Stock stock = stockService.findOrCreateEntityByTicker(rawTicker);

        watchlist.addStock(stock);

        return watchlistMapper.toStockSummaryDto(stock);
    }

    @Transactional
    public void removeStockFromWatchlist(Long watchlistId, Long stockId) {
        Watchlist watchlist = getWatchlistById(watchlistId);
        Stock stock = stockService.getStockEntityById(stockId);

        if (!watchlist.getStocks().contains(stock)) {
            log.warn("Cannot remove stock id={} from watchlist id={} because it is not linked", stockId, watchlistId);
            throw new StockNotFoundException(stockId);
        }

        watchlist.removeStock(stock);
    }

    private Watchlist getWatchlistById(Long id) {
        return watchlistRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Watchlist lookup failed for id={}", id);
                    return new WatchlistNotFoundException(id);
                });
    }
}
