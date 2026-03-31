package com.phgdae.backend.Genes;

import com.phgdae.backend.Service.GeneService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/genes")
public class GeneController {

    private final GeneService geneService;
    private final GeneRepository geneRepository;

    public GeneController(GeneService geneService, GeneRepository geneRepository) {
        this.geneService = geneService;
        this.geneRepository = geneRepository;
    }

    @GetMapping
    public List<Gene> getAllGenes() {
        return geneRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gene> getGeneById(@PathVariable String id) {
        return geneRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createGene(@RequestBody Gene gene) {
        try {
            Gene saved = geneService.saveGene(gene);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("message", "A gene with this symbol or ID already exists."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}