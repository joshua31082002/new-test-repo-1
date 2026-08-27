package com.revolte.catalog.controller;

import com.revolte.catalog.model.Product;
import com.revolte.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController @RequestMapping("/api/products") @Tag(name = "Products")
public class ProductApiController {
    private final CatalogService catalog;
    public ProductApiController(CatalogService catalog) { this.catalog = catalog; }
    @GetMapping @Operation(summary = "Search active products")
    public ProductPage list(@RequestParam(defaultValue = "") String q, @RequestParam(defaultValue = "") String category,
        @RequestParam(required = false) @DecimalMin("0.00") BigDecimal minPrice, @RequestParam(required = false) @DecimalMin("0.00") BigDecimal maxPrice,
        @RequestParam(defaultValue = "0") @Min(0) int page, @RequestParam(defaultValue = "12") @Min(1) @Max(24) int size, @RequestParam(defaultValue = "newest") String sort) {
        return page(catalog.search(q, category, minPrice, maxPrice, page, size, sort));
    }
    @GetMapping("/{id}") @Operation(summary = "Get an active product")
    public ProductResponse get(@PathVariable @Min(1) Long id) { return ProductResponse.from(catalog.findActive(id)); }
    static ProductPage page(Page<Product> result) { return new ProductPage(result.getContent().stream().map(ProductResponse::from).toList(), result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()); }
    public record ProductPage(java.util.List<ProductResponse> products, int page, int size, long totalElements, int totalPages) {}
    public record ProductResponse(Long id, String name, String description, BigDecimal price, String imageUrl, String status, String category, java.time.Instant createdAt) {
        static ProductResponse from(Product p) { return new ProductResponse(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getImageUrl(), p.getStatus().name(), p.getCategory().getName(), p.getCreatedAt()); }
    }
}
