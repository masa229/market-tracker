package app.equityinsight.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTickerException extends RuntimeException {
    public InvalidTickerException(String ticker) {
        super("Ticker symbol '" + ticker + "' is invalid. It must contain 1 to 4 letters or numbers.");
    }
}
