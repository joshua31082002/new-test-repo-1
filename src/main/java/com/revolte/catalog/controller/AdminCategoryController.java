package com.revolte.catalog.controller;

import com.revolte.catalog.model.Category;
import com.revolte.catalog.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/admin/categories") @Tag(name = "Admin categories")
public class AdminCategoryController {
    private final CategoryService service;
    public AdminCategoryController(CategoryService service) { this.service = service; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public CategoryResponse create(@Valid @RequestBody CategoryRequest request) { return CategoryResponse.from(service.create(request.name())); }
    @PutMapping("/{id}") public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) { return CategoryResponse.from(service.update(id, request.name())); }
    public record CategoryRequest(@NotBlank @Size(max=80) String name) {}
    public record CategoryResponse(Long id, String name) { static CategoryResponse from(Category c) { return new CategoryResponse(c.getId(), c.getName()); } }
}
