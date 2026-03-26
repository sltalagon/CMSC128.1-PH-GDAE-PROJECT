package com.phgdae.backend.GeneCategory;

import com.phgdae.backend.Service.GeneCategoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/gene-categories")
public class GeneCategoryController {

    private final GeneCategoryService geneCategoryService;
    private final GeneCategoryRepository geneCategoryRepository;

    public GeneCategoryController(GeneCategoryService geneCategoryService, GeneCategoryRepository geneCategoryRepository) {
        this.geneCategoryService = geneCategoryService;
        this.geneCategoryRepository = geneCategoryRepository;
    }

    @GetMapping
    public List<GeneCategory> getAllGeneCategories() {
        return geneCategoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneCategory> getGeneCategoryById(@PathVariable String id) {
        return geneCategoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GeneCategory createGeneCategory(@RequestBody GeneCategory geneCategory) {
        return geneCategoryService.saveGeneCategory(geneCategory);
    }
}