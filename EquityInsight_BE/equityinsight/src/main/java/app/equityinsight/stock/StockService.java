package app.equityinsight.stock;

import app.equityinsight.exception.InvalidTickerException;
import app.equityinsight.exception.StockNotFoundException;
import app.equityinsight.stock.dto.StockDto;
import app.equityinsight.stock.dto.StockPriceHistoryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    private static final Logger log = LoggerFactory.getLogger(StockService.class);

    private final StockRepository stockRepository;
    private final MockStockDataService mockStockDataService;

    public StockService(StockRepository stockRepository, MockStockDataService mockStockDataService) {
        this.stockRepository = stockRepository;
        this.mockStockDataService = mockStockDataService;
    }

    public StockDto getStockById(Long id) {
        Stock stock = getStockEntityById(id);

        return new StockDto(
                stock.getId(),
                stock.getTickerSymbol()
        );
    }

    public StockDto findOrCreateByTicker(String rawTickerSymbol) {
        Stock stock = findOrCreateEntityByTicker(rawTickerSymbol);
        return new StockDto(stock.getId(), stock.getTickerSymbol());
    }

    public StockPriceHistoryDto getPriceHistory(String rawTickerSymbol, String range) {
        String tickerSymbol = normalizeAndValidateTicker(rawTickerSymbol);
        return mockStockDataService.getHistoricalPrices(tickerSymbol, range);
    }

    public Stock getStockEntityById(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Stock lookup failed for id={}", id);
                    return new StockNotFoundException(id);
                });
    }

    public Stock findOrCreateEntityByTicker(String rawTickerSymbol) {
        String tickerSymbol = normalizeAndValidateTicker(rawTickerSymbol);

        return stockRepository.findByTickerSymbolIgnoreCase(tickerSymbol)
                .orElseGet(() -> {
                    Stock stock = new Stock(tickerSymbol);
                    return stockRepository.save(stock);
                });
    }

    private String normalizeAndValidateTicker(String rawTickerSymbol) {
        if (rawTickerSymbol == null) {
            log.warn("Ticker validation failed because the ticker was null");
            throw new InvalidTickerException("null");
        }

        String tickerSymbol = rawTickerSymbol.trim().toUpperCase();

        if (!tickerSymbol.matches("^[A-Z0-9]{1,4}$")) {
            log.warn("Ticker validation failed for ticker='{}'", rawTickerSymbol);
            throw new InvalidTickerException(rawTickerSymbol);
        }

        return tickerSymbol;
    }
}
