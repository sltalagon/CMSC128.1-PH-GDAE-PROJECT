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
    public ResponseEntity<FunctionalCategory> getFunctionalCategoryById(@PathVariable("id") String id) {
        return functionalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFunctionalCategory(@PathVariable("id") String id) {
        if (functionalRepository.existsById(id)) {
            functionalRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<FunctionalCategory> updateFunctionalCategory(@PathVariable("id") String id, @RequestBody FunctionalCategory categoryDetails) {
        return functionalRepository.findById(id).map(existingCategory -> {
            existingCategory.setCategoryName(categoryDetails.getCategoryName());
            existingCategory.setDescription(categoryDetails.getDescription());

            functionalRepository.save(existingCategory);
            return ResponseEntity.ok(existingCategory);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FunctionalCategory createFunctionalCategory(@RequestBody FunctionalCategory functionalCategory) {
        return functionalCategoryService.saveFunctionalCategory(functionalCategory);
    }
}