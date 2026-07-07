package app.equityinsight.stock;

import app.equityinsight.stock.dto.StockPriceHistoryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stocks")
@Tag(name = "Stocks", description = "Stock price history endpoints")
public class StockController {

    private static final String ALPHA_VANTAGE_API_KEY_HEADER = "X-Alpha-Vantage-Api-Key";

    private final MockStockDataService mockStockDataService;

    public StockController(MockStockDataService mockStockDataService) {
        this.mockStockDataService = mockStockDataService;
    }

    @GetMapping("/{ticker}/prices")
    @Operation(summary = "Get stock price history")
    public StockPriceHistoryDto getPriceHistory(
            @Parameter(description = "Ticker symbol, 1 to 4 letters or numbers")
            @PathVariable String ticker,
            @Parameter(description = "Price history range such as 1M, 3M, 6M, or 1Y")
            @RequestParam(defaultValue = "1M") String range,
            @Parameter(description = "Alpha Vantage API key used for live data requests")
            @RequestHeader(value = ALPHA_VANTAGE_API_KEY_HEADER, required = false) String alphaVantageApiKey
    ) {
        return mockStockDataService.getHistoricalPrices(ticker, range, alphaVantageApiKey);
    }
}
