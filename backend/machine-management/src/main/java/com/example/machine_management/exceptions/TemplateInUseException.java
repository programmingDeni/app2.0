package com.example.machine_management.exceptions;

public class TemplateInUseException extends RuntimeException {
    public TemplateInUseException(String message) {
        super(message);
    }
}
