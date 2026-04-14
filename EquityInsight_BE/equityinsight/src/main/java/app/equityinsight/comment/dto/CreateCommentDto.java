package app.equityinsight.comment.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentDto(
        @NotBlank(message = "Content must not be blank") String content
) {
}
