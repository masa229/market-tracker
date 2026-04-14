package app.equityinsight.comment;

import app.equityinsight.comment.dto.CommentDto;
import app.equityinsight.comment.dto.CreateCommentDto;
import app.equityinsight.exception.CommentNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    public CommentService(CommentRepository commentRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
    }

    public CommentDto createComment(CreateCommentDto dto) {
        Comment comment = new Comment(dto.content());
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    public CommentDto updateContent(Long id, String content) {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new CommentNotFoundException(id));
        comment.setContent(content);
        commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.findById(id).orElseThrow(() -> new CommentNotFoundException(id));
        commentRepository.deleteById(id);
    }
}
