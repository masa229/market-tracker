package app.equityinsight.stock;

import app.equityinsight.comment.Comment;
import app.equityinsight.watchlist.Watchlist;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tickerSymbol;

    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "stock_watchlist",
            joinColumns = @JoinColumn(name = "stock_id"),
            inverseJoinColumns = @JoinColumn(name = "watchlist_id")
    )
    private Set<Watchlist> watchlists = new HashSet<>();

    protected Stock() {
    }

    public Stock(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public Long getId() {
        return id;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public Set<Watchlist> getWatchlists() {
        return watchlists;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setStock(this);
    }
}