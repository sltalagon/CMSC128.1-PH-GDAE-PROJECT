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
            // Basic OMIM ID range validation (valid OMIM IDs are 6 digits)
            if (gene.getOmimId() != null) {
                long omim = gene.getOmimId().longValue();
                if (omim < 100000 || omim > 999999) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "OMIM ID must be a 6-digit number."));
                }
            }
            Gene saved = geneService.saveGene(gene);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409)
                    .body(Map.of("message", "A gene with this symbol, OMIM ID, or NCBI ID already exists."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}