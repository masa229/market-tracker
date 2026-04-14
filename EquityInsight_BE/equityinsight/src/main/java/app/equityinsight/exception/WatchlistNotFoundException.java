package app.equityinsight.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WatchlistNotFoundException extends RuntimeException {
    public WatchlistNotFoundException(Long id) {
        super("Task not found, id:" + id);
    }
}
