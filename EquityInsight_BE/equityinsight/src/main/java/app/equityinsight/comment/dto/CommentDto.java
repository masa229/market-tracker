package app.equityinsight.comment.dto;

import java.time.LocalDateTime;

public record CommentDto(
        Long id,
        String content,
        LocalDateTime creationDate,
        LocalDateTime lastEditedDate
) {
}
