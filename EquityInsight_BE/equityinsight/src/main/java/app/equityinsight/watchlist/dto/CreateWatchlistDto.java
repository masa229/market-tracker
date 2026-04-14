package app.equityinsight.watchlist.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateWatchlistDto(
        @NotBlank(message = "Title must not be blank") String title
) {
}
