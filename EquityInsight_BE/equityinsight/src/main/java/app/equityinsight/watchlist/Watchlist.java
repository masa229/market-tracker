package watchlist;

import stock.Stock;
import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name = "watchlist")
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private ArrayList<Stock> stocks;

    public Watchlist(String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<Stock> getStocks() {
        return stocks;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void addStock(Stock stock) {
        this.stocks.add(stock);
    }
}
