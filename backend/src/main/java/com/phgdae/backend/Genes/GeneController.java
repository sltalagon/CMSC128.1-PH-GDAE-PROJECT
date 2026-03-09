package com.phgdae.backend.Genes;

import com.phgdae.backend.Service.GeneService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

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
    public Gene createGene(@RequestBody Gene gene) {
        return geneService.saveGene(gene);
    }
}