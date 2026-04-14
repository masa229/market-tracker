package app.equityinsight.comment;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public void getCommentsByStock() {}

    @PostMapping
    public void createComment() {}

    @DeleteMapping
    public void deleteComment() {}

    @PatchMapping
    public void updateCommentContent() {}
}
