package app.equityinsight.comment.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateCommentDto(
        @NotBlank(message = "Content must not be blank")
        String content
) {
}