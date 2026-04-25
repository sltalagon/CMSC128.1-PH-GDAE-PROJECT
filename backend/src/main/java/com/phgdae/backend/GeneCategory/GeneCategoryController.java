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
    public ResponseEntity<GeneCategory> getGeneCategoryById(@PathVariable("id") String id) {
        return geneCategoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGeneCategory(@PathVariable("id") String id) {
        if (geneCategoryRepository.existsById(id)) {
            geneCategoryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeneCategory> updateGeneCategory(@PathVariable("id") String id, @RequestBody GeneCategory linkDetails) {
        return geneCategoryRepository.findById(id).map(existingLink -> {
            existingLink.setGene(linkDetails.getGene());
            existingLink.setFunctionalCategory(linkDetails.getFunctionalCategory());

            geneCategoryRepository.save(existingLink);
            return ResponseEntity.ok(existingLink);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GeneCategory createGeneCategory(@RequestBody GeneCategory geneCategory) {
        return geneCategoryService.saveGeneCategory(geneCategory);
    }
}