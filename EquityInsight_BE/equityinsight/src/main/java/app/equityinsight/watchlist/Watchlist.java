package app.equityinsight.watchlist;

import app.equityinsight.stock.Stock;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "watchlist")
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToMany(mappedBy = "watchlists")
    private Set<Stock> stocks = new HashSet<>();

    protected Watchlist() {
    }

    public Watchlist(String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Set<Stock> getStocks() {
        return stocks;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void addStock(Stock stock) {
        stocks.add(stock);
        stock.getWatchlists().add(this);
    }

    public void removeStock(Stock stock) {
        stocks.remove(stock);
        stock.getWatchlists().remove(this);
    }
}
