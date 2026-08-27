package com.revolte.catalog.controller;

import com.revolte.catalog.repository.CategoryRepository;
import com.revolte.catalog.service.CatalogService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@Controller
public class CatalogController {
    private final CatalogService catalog; private final CategoryRepository categories;
    public CatalogController(CatalogService catalog, CategoryRepository categories) { this.catalog = catalog; this.categories = categories; }
    @GetMapping("/") public String listing(@RequestParam(defaultValue = "") String q, @RequestParam(defaultValue = "") String category,
        @RequestParam(required = false) BigDecimal minPrice, @RequestParam(required = false) BigDecimal maxPrice, @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size, @RequestParam(defaultValue = "newest") String sort, Model model) {
        var result = catalog.search(q, category, minPrice, maxPrice, page, size, sort);
        model.addAttribute("products", result); model.addAttribute("categories", categories.findAll(Sort.by("name")));
        model.addAttribute("q", q); model.addAttribute("selectedCategory", category); model.addAttribute("minPrice", minPrice); model.addAttribute("maxPrice", maxPrice); model.addAttribute("selectedSort", sort);
        return "catalog";
    }
    @GetMapping("/products/{id}") public String detail(@PathVariable Long id, Model model) { model.addAttribute("product", catalog.findActive(id)); return "product-detail"; }
}
