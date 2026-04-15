package app.equityinsight.stock.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PricePointDto(
        LocalDate date,
        BigDecimal closePrice
) {
}