package com.phgdae.backend; // Adjust package name if you put it in a specific folder

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        // This intercepts the error and forces Spring Boot to send it as:
        // { "message": "An association between this gene..." }
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }
}