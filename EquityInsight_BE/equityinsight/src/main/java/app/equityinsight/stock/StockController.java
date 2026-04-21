package app.equityinsight.stock;

import app.equityinsight.stock.dto.StockPriceHistoryDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stocks")
public class StockController {

    private final MockStockDataService mockStockDataService;

    public StockController(MockStockDataService mockStockDataService) {
        this.mockStockDataService = mockStockDataService;
    }

    @GetMapping("/{ticker}/prices")
    public StockPriceHistoryDto getPriceHistory(
            @PathVariable String ticker,
            @RequestParam(defaultValue = "1M") String range
    ) {
        return mockStockDataService.getHistoricalPrices(ticker, range);
    }
}