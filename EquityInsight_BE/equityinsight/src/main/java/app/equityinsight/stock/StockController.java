package app.equityinsight.stock;

import app.equityinsight.stock.dto.StockDto;
import app.equityinsight.stock.dto.StockPriceHistoryDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/{id}")
    public StockDto getStockById(@PathVariable Long id) {
        return stockService.getStockById(id);
    }

    @PostMapping("/register")
    public StockDto findOrCreateByTicker(@RequestParam String ticker) {
        return stockService.findOrCreateByTicker(ticker);
    }

    @GetMapping("/{ticker}/prices")
    public StockPriceHistoryDto getPriceHistory(
            @PathVariable String ticker,
            @RequestParam String range
    ) {
        return stockService.getPriceHistory(ticker, range);
    }
}