package stock;

import comment.Comment;
import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private final String tickerSymbol;

    private ArrayList<Comment> comments;

    public Stock(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public Long getId() {
        return id;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public ArrayList<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }
}
