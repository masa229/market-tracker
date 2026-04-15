package app.equityinsight.comment;

import app.equityinsight.comment.dto.CommentDto;
import app.equityinsight.comment.dto.CreateCommentDto;
import app.equityinsight.comment.dto.UpdateCommentDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/stock/{stockId}")
    public List<CommentDto> getCommentsByStockId(@PathVariable Long stockId) {
        return commentService.getCommentsByStockId(stockId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentDto createComment(@Valid @RequestBody CreateCommentDto dto) {
        return commentService.createComment(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public CommentDto updateCommentContent(@PathVariable Long id, @Valid @RequestBody UpdateCommentDto dto) {
        return commentService.updateContent(id, dto);
    }
}