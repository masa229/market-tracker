package app.equityinsight.comment;

import app.equityinsight.comment.dto.CommentDto;
import app.equityinsight.comment.dto.CreateCommentDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentDto createComment(@Valid @RequestBody CreateCommentDto dto) {
        return commentService.createComment(dto);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping
    public CommentDto updateCommentContent(@PathVariable Long id, @RequestBody String content) {
        return commentService.updateContent(id, content);
    }
}
