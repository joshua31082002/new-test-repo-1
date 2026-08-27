package com.revolte.catalog.controller;

import com.revolte.catalog.service.CatalogService.ProductNotFoundException;
import com.revolte.catalog.service.CategoryService.CatalogNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler({MethodArgumentTypeMismatchException.class, IllegalArgumentException.class, ConstraintViolationException.class, MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST) public ErrorResponse invalidRequest(Exception ignored) { return new ErrorResponse("INVALID_REQUEST", "Please check the request and try again."); }
    @ExceptionHandler({ProductNotFoundException.class, CatalogNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND) public ErrorResponse notFound(Exception ignored) { return new ErrorResponse("NOT_FOUND", "The requested resource was not found."); }
    public record ErrorResponse(String code, String message) {}
}
