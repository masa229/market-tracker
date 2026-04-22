package app.equityinsight.comment;

import app.equityinsight.comment.dto.CommentDto;
import app.equityinsight.comment.dto.CreateCommentDto;
import app.equityinsight.comment.dto.UpdateCommentDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@Tag(name = "Comments", description = "Comment management endpoints")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/stock/{stockId}")
    @Operation(summary = "Get comments for a stock")
    public List<CommentDto> getCommentsByStockId(@PathVariable Long stockId) {
        return commentService.getCommentsByStockId(stockId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a comment")
    public CommentDto createComment(@Valid @RequestBody CreateCommentDto dto) {
        return commentService.createComment(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a comment")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a comment")
    public CommentDto updateCommentContent(@PathVariable Long id, @Valid @RequestBody UpdateCommentDto dto) {
        return commentService.updateContent(id, dto);
    }
}
