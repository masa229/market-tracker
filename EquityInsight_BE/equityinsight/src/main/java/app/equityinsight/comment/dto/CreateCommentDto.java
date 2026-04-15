package app.equityinsight.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCommentDto(
        @NotBlank(message = "Content must not be blank")
        String content,

        @NotNull(message = "Stock id must not be null")
        Long stockId
) {
}