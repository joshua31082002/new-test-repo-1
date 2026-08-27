package com.revolte.catalog.controller;

import com.revolte.catalog.model.*;
import com.revolte.catalog.repository.CategoryRepository;
import com.revolte.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController @RequestMapping("/api/admin/products") @Tag(name = "Admin products")
public class AdminProductController {
    private final CatalogService catalog; private final CategoryRepository categories;
    public AdminProductController(CatalogService catalog, CategoryRepository categories) { this.catalog = catalog; this.categories = categories; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public ProductApiController.ProductResponse create(@Valid @RequestBody ProductRequest request) { return ProductApiController.ProductResponse.from(save(new Product(request.name(), request.description(), request.price(), request.imageUrl(), request.status(), category(request.categoryId())))); }
    @PutMapping("/{id}") public ProductApiController.ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) { Product product = catalog.findAny(id); product.update(request.name(), request.description(), request.price(), request.imageUrl(), request.status(), category(request.categoryId())); return ProductApiController.ProductResponse.from(save(product)); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deactivate(@PathVariable Long id) { Product product = catalog.findAny(id); product.deactivate(); save(product); }
    private Product save(Product product) { return catalog.save(product); }
    private Category category(Long id) { return categories.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found")); }
    public record ProductRequest(@NotBlank @Size(max=140) String name, @NotBlank @Size(max=1000) String description, @NotNull @DecimalMin("0.00") @Digits(integer=8, fraction=2) BigDecimal price, @NotBlank @Size(max=512) String imageUrl, @NotNull ProductStatus status, @NotNull @Positive Long categoryId) {}
}
