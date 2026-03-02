package com.phgdae.backend.Functional;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/functional_categories")
public class FunctionalCategoryController {

    private final FunctionalCategoryRepository functionalRepository;

    public FunctionalCategoryController(FunctionalCategoryRepository functionalRepository) {
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
    public FunctionalCategory createDisease(@RequestBody FunctionalCategory functionalCategory) {
        return functionalRepository.save(functionalCategory);
    }
}