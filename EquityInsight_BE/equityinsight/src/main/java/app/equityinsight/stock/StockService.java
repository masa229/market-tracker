package app.equityinsight.stock;

import app.equityinsight.exception.StockNotFoundException;
import app.equityinsight.stock.dto.PricePointDto;
import app.equityinsight.stock.dto.StockDto;
import app.equityinsight.stock.dto.StockPriceHistoryDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final StooqService stooqService;

    public StockService(StockRepository stockRepository, StooqService stooqService) {
        this.stockRepository = stockRepository;
        this.stooqService = stooqService;
    }

    public StockDto getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new StockNotFoundException(id));

        return new StockDto(
                stock.getId(),
                stock.getTickerSymbol()
        );
    }

    public StockDto findOrCreateByTicker(String tickerSymbol) {
        return stockRepository.findByTickerSymbolIgnoreCase(tickerSymbol)
                .map(stock -> new StockDto(stock.getId(), stock.getTickerSymbol()))
                .orElseGet(() -> {
                    Stock stock = new Stock(tickerSymbol.toUpperCase());
                    Stock saved = stockRepository.save(stock);
                    return new StockDto(saved.getId(), saved.getTickerSymbol());
                });
    }

    public StockPriceHistoryDto getPriceHistory(String tickerSymbol, String range) {
        List<PricePointDto> prices = stooqService.getHistoricalPrices(tickerSymbol, range);

        return new StockPriceHistoryDto(
                tickerSymbol.toUpperCase(),
                range,
                prices
        );
    }
}