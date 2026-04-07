package app.equityinsight.stock;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public Optional<Stock> getStock(Long id) {
        return stockRepository.findById(id);
    }
}
