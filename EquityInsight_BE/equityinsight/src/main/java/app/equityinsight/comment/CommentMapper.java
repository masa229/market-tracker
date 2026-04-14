package app.equityinsight.comment;

import app.equityinsight.comment.dto.CommentDto;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentDto toDto(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getContent(),
                comment.getCreationDate(),
                comment.getLastEditedDate()
        );
    }
}
