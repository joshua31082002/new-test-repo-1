package com.revolte.catalog.service;

import com.revolte.catalog.model.Category;
import com.revolte.catalog.repository.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
    private final CategoryRepository categories;
    public CategoryService(CategoryRepository categories) { this.categories = categories; }
    public Category get(Long id) { return categories.findById(id).orElseThrow(() -> new CatalogNotFoundException("Category not found")); }
    public Category create(String name) { if (categories.findByNameIgnoreCase(name).isPresent()) throw new IllegalArgumentException("Category already exists"); return categories.save(new Category(name.trim())); }
    public Category update(Long id, String name) { Category category = get(id); category.rename(name.trim()); return categories.save(category); }
    public static class CatalogNotFoundException extends RuntimeException { public CatalogNotFoundException(String message) { super(message); } }
}
