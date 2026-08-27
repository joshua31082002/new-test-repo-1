package com.revolte.catalog.repository;

import com.revolte.catalog.model.Product;
import com.revolte.catalog.model.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("select p from Product p join fetch p.category c where p.status = :status and (:query = '' or lower(p.name) like lower(concat('%', :query, '%')) or lower(p.description) like lower(concat('%', :query, '%'))) and (:category = '' or c.name = :category) and (:minPrice is null or p.price >= :minPrice) and (:maxPrice is null or p.price <= :maxPrice)")
    Page<Product> search(@Param("query") String query, @Param("category") String category, @Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, @Param("status") ProductStatus status, Pageable pageable);
    @Query("select p from Product p join fetch p.category where p.id = :id")
    Optional<Product> findWithCategoryById(@Param("id") Long id);
}
