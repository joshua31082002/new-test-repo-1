package com.revolte.catalog.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_category", columnList = "category_id"),
    @Index(name = "idx_products_status", columnList = "status"),
    @Index(name = "idx_products_created_at", columnList = "created_at"),
    @Index(name = "idx_products_name", columnList = "name")
})
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 140) private String name;
    @Column(nullable = false, length = 1000) private String description;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal price;
    @Column(name = "image_url", nullable = false, length = 512) private String imageUrl;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ProductStatus status;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "category_id", nullable = false) private Category category;

    protected Product() {}
    public Product(String name, String description, BigDecimal price, String imageUrl, ProductStatus status, Category category) {
        this.name = name; this.description = description; this.price = price; this.imageUrl = imageUrl; this.status = status; this.category = category;
    }
    @PrePersist void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
    public Long getId() { return id; } public String getName() { return name; } public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; } public String getImageUrl() { return imageUrl; } public ProductStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; } public Category getCategory() { return category; }
    public void update(String name, String description, BigDecimal price, String imageUrl, ProductStatus status, Category category) {
        this.name = name; this.description = description; this.price = price; this.imageUrl = imageUrl; this.status = status; this.category = category;
    }
    public void deactivate() { this.status = ProductStatus.INACTIVE; }
}
