package app.equityinsight.stock;

import app.equityinsight.comment.Comment;
import app.equityinsight.watchlist.Watchlist;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private final String tickerSymbol;

    @OneToMany(mappedBy = "stock")
    private List<Comment> comments;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "stock_watchlist",
            joinColumns = @JoinColumn(name = "watchlist_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "stock_id", referencedColumnName = "id"))
    private List<Watchlist> watchlists;

    public Stock(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public Long getId() {
        return id;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public List<Watchlist> getWatchlists() {
        return watchlists;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }
}
