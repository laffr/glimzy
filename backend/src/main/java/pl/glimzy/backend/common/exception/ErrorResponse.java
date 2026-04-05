package pl.glimzy.backend.common.exception;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ErrorResponse {

    private final String message;
    private final int status;
    private final String error;
    private final String path;
    private final LocalDateTime timestamp;

    public ErrorResponse(String message, int status, String error, String path) {
        this.message = message;
        this.status = status;
        this.error = error;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
