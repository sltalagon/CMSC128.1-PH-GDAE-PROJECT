package com.phgdae.backend.Functional;

import com.phgdae.backend.Service.FunctionalCategoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/functional_categories")
public class FunctionalCategoryController {

    private final FunctionalCategoryService functionalCategoryService;
    private final FunctionalCategoryRepository functionalRepository;

    public FunctionalCategoryController(FunctionalCategoryService functionalCategoryService, FunctionalCategoryRepository functionalRepository) {
        this.functionalCategoryService = functionalCategoryService;
        this.functionalRepository = functionalRepository;
    }

    @GetMapping
    public List<FunctionalCategory> getAllFunctionalCategories() {
        return functionalRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FunctionalCategory> getFunctionalCategoryById(@PathVariable String id) {
        return functionalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FunctionalCategory createFunctionalCategory(@RequestBody FunctionalCategory functionalCategory) {
        return functionalCategoryService.saveFunctionalCategory(functionalCategory);
    }
}