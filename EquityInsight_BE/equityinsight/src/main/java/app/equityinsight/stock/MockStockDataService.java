package app.equityinsight.stock;

import app.equityinsight.exception.InvalidTickerException;
import app.equityinsight.stock.dto.PricePointDto;
import app.equityinsight.stock.dto.StockPriceHistoryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class MockStockDataService {

    private static final Logger log = LoggerFactory.getLogger(MockStockDataService.class);

    public StockPriceHistoryDto getHistoricalPrices(String rawTicker, String range) {
        String ticker = normalizeAndValidateTicker(rawTicker);
        int days = mapRangeToDays(range);
        List<PricePointDto> prices = generatePrices(ticker, days);
        return new StockPriceHistoryDto(
                ticker,
                range.toUpperCase(),
                prices
        );
    }

    private String normalizeAndValidateTicker(String rawTicker) {
        if (rawTicker == null) {
            log.warn("Mock stock data rejected a null ticker");
            throw new InvalidTickerException("null");
        }
        String ticker = rawTicker.trim().toUpperCase();
        if (!ticker.matches("^[A-Z0-9]{1,4}$")) {
            log.warn("Mock stock data rejected ticker='{}'", rawTicker);
            throw new InvalidTickerException(rawTicker);
        }
        return ticker;
    }

    private int mapRangeToDays(String rawRange) {
        if (rawRange == null) {
            return 30;
        }
        return switch (rawRange.trim().toUpperCase()) {
            case "1M" -> 30;
            case "3M" -> 90;
            case "6M" -> 180;
            case "1Y" -> 365;
            default -> 30;
        };
    }

    private List<PricePointDto> generatePrices(String ticker, int days) {
        List<PricePointDto> prices = new ArrayList<>();
        Random random = new Random();
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        double currentPrice = 40 + random.nextDouble() * 210;
        for (int i = 0; i < days; i++) {
            double trend = (random.nextDouble() - 0.5) * 0.8;
            double dailyChange = trend + (random.nextDouble() - 0.5) * 4.0;
            currentPrice = Math.max(5.0, currentPrice + dailyChange);
            BigDecimal roundedPrice = BigDecimal.valueOf(currentPrice)
                    .setScale(2, RoundingMode.HALF_UP);
            prices.add(new PricePointDto(
                    startDate.plusDays(i),
                    roundedPrice
            ));
        }

        return prices;
    }
}
