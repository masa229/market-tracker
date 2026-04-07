package ipa.equityinsight.api.comment;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDate creationDate;

    protected Comment() {
    }

    public Comment(String content, String description, LocalDate creationDate) {
        this.content = content;
        this.creationDate = creationDate;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return content;
    }

    public LocalDate getDueDate() {
        return creationDate;
    }

    public void setTitle(String content) {
        this.content = content;
    }

    public void setDueDate(LocalDate dueDate) {
        this.creationDate = dueDate;
    }
}