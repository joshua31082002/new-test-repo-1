package com.revolte.catalog.controller;

import com.revolte.catalog.model.Category;
import com.revolte.catalog.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/categories") @Tag(name = "Categories")
public class CategoryController {
    private final CategoryRepository categories;
    public CategoryController(CategoryRepository categories) { this.categories = categories; }
    @GetMapping public List<CategoryResponse> list() { return categories.findAll().stream().map(CategoryResponse::from).toList(); }
    public record CategoryResponse(Long id, String name) { static CategoryResponse from(Category c) { return new CategoryResponse(c.getId(), c.getName()); } }
}
