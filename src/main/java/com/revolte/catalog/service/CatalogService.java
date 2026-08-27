package com.revolte.catalog.service;

import com.revolte.catalog.model.*;
import com.revolte.catalog.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class CatalogService {
    private static final int MAX_PAGE_SIZE = 24;
    private final ProductRepository products;
    public CatalogService(ProductRepository products) { this.products = products; }
    public Page<Product> search(String query, String category, BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sort) {
        if (minPrice != null && minPrice.signum() < 0 || maxPrice != null && maxPrice.signum() < 0) throw new IllegalArgumentException("Price cannot be negative");
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) throw new IllegalArgumentException("minPrice cannot exceed maxPrice");
        Sort sorting = switch (sort) { case "price-asc" -> Sort.by("price").ascending(); case "price-desc" -> Sort.by("price").descending(); case "name" -> Sort.by("name").ascending(); case "newest" -> Sort.by("createdAt").descending(); default -> throw new IllegalArgumentException("Unsupported sort"); };
        return products.search(query == null ? "" : query.trim(), category == null ? "" : category.trim(), minPrice, maxPrice, ProductStatus.ACTIVE, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE), sorting));
    }
    public Product findAny(Long id) { return products.findWithCategoryById(id).orElseThrow(() -> new ProductNotFoundException(id)); }
    public Product findActive(Long id) { Product product = findAny(id); if (product.getStatus() != ProductStatus.ACTIVE) throw new ProductNotFoundException(id); return product; }
    public Product save(Product product) { return products.save(product); }
    public static class ProductNotFoundException extends RuntimeException { public ProductNotFoundException(Long id) { super("Product not found: " + id); } }
}
