package app.equityinsight.stock;

import app.equityinsight.exception.InvalidTickerException;
import app.equityinsight.stock.dto.PricePointDto;
import app.equityinsight.stock.dto.StockPriceHistoryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

@Service
public class MockStockDataService {

    private static final Logger log = LoggerFactory.getLogger(MockStockDataService.class);
    private static final String ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co";
    private static final String ALPHA_VANTAGE_TIME_SERIES_FIELD = "Time Series (Daily)";
    private static final String ALPHA_VANTAGE_CLOSE_FIELD = "4. close";
    private final RestClient restClient;

    public MockStockDataService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl(ALPHA_VANTAGE_BASE_URL)
                .build();
    }

    public StockPriceHistoryDto getHistoricalPrices(String rawTicker, String rawRange, String rawAlphaVantageApiKey) {
        String ticker = normalizeAndValidateTicker(rawTicker);
        String range = normalizeRange(rawRange);
        int days = mapRangeToDays(range);
        String alphaVantageApiKey = normalizeApiKey(rawAlphaVantageApiKey);

        if (alphaVantageApiKey != null) {
            return fetchAlphaVantagePrices(ticker, range, days, alphaVantageApiKey);
        }

        List<PricePointDto> prices = generatePrices(ticker, days);
        return new StockPriceHistoryDto(
                ticker,
                range,
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

    private String normalizeRange(String rawRange) {
        if (rawRange == null) {
            return "1M";
        }

        return switch (rawRange.trim().toUpperCase()) {
            case "3M" -> "3M";
            case "6M" -> "6M";
            case "1Y" -> "1Y";
            default -> "1M";
        };
    }

    private int mapRangeToDays(String range) {
        return switch (range) {
            case "1M" -> 30;
            case "3M" -> 90;
            case "6M" -> 180;
            case "1Y" -> 365;
            default -> 30;
        };
    }

    private String normalizeApiKey(String rawAlphaVantageApiKey) {
        if (rawAlphaVantageApiKey == null) {
            return null;
        }

        String normalizedApiKey = rawAlphaVantageApiKey.trim();
        return normalizedApiKey.isEmpty() ? null : normalizedApiKey;
    }

    private StockPriceHistoryDto fetchAlphaVantagePrices(
            String ticker,
            String range,
            int days,
            String alphaVantageApiKey
    ) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/query")
                            .queryParam("function", "TIME_SERIES_DAILY")
                            .queryParam("symbol", ticker)
                            .queryParam("outputsize", days > 100 ? "full" : "compact")
                            .queryParam("apikey", alphaVantageApiKey)
                            .build())
                    .retrieve()
                    .body(Map.class);

            if (responseBody == null) {
                log.warn("Alpha Vantage returned an empty response for ticker='{}'", ticker);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Alpha Vantage returned no data");
            }

            if (responseBody.containsKey("Error Message")) {
                log.warn("Alpha Vantage rejected ticker='{}'", ticker);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Alpha Vantage rejected the request");
            }

            if (responseBody.containsKey("Note")) {
                log.warn("Alpha Vantage rate limited ticker='{}'", ticker);
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Alpha Vantage rate limit reached"
                );
            }

            Object priceSeries = responseBody.get(ALPHA_VANTAGE_TIME_SERIES_FIELD);
            if (!(priceSeries instanceof Map<?, ?> dailySeries)) {
                log.warn("Alpha Vantage returned no daily series for ticker='{}'", ticker);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Alpha Vantage returned no price history");
            }

            LocalDate minimumDate = LocalDate.now().minusDays(days - 1L);
            List<PricePointDto> prices = dailySeries.entrySet().stream()
                    .map(this::toPricePoint)
                    .filter(Objects::nonNull)
                    .filter(pricePoint -> !pricePoint.date().isBefore(minimumDate))
                    .sorted(Comparator.comparing(PricePointDto::date))
                    .toList();

            if (prices.isEmpty()) {
                log.warn("Alpha Vantage returned no recent prices for ticker='{}'", ticker);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Alpha Vantage returned no recent prices");
            }

            return new StockPriceHistoryDto(ticker, range, prices);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (RestClientException ex) {
            log.warn("Alpha Vantage request failed for ticker='{}'", ticker, ex);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to load Alpha Vantage data", ex);
        }
    }

    private PricePointDto toPricePoint(Map.Entry<?, ?> seriesEntry) {
        if (!(seriesEntry.getKey() instanceof String dateText)) {
            return null;
        }

        if (!(seriesEntry.getValue() instanceof Map<?, ?> pricePointValues)) {
            return null;
        }

        Object closeValue = pricePointValues.get(ALPHA_VANTAGE_CLOSE_FIELD);
        if (!(closeValue instanceof String closeText) || closeText.isBlank()) {
            return null;
        }

        try {
            return new PricePointDto(
                    LocalDate.parse(dateText),
                    new BigDecimal(closeText)
            );
        } catch (RuntimeException ex) {
            log.debug("Skipping malformed Alpha Vantage point for date='{}'", dateText, ex);
            return null;
        }
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
