package app.equityinsight.comment;

import app.equityinsight.stock.Stock;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private LocalDateTime lastEditedDate;

    @OneToMany
    @JoinColumn(name = "stock_id")
    private Stock stock;

    protected Comment() {
    }

    public Comment(String content, LocalDateTime creationDate, LocalDateTime lastEditedDate) {
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public LocalDateTime getLastEditedDate() {
        return lastEditedDate;
    }

    public void setContent(String content) {
        this.content = content;
    }

}