package com.revolte.catalog.repository;

import com.revolte.catalog.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> { Optional<Category> findByNameIgnoreCase(String name); }
