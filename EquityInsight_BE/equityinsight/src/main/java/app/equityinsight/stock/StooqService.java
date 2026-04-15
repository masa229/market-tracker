package app.equityinsight.stock;

import app.equityinsight.stock.dto.PricePointDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StooqService {

    public List<PricePointDto> getHistoricalPrices(String tickerSymbol, String range) {
        // TODO
        throw new UnsupportedOperationException("Not implemented yet");
    }
}