package com.phgdae.backend.GeneDisease;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/genedisease")
public class GeneDiseaseController {

    private final GeneDiseaseRepository geneDiseaseRepository;

    public GeneDiseaseController(GeneDiseaseRepository geneDiseaseRepository) {
        this.geneDiseaseRepository = geneDiseaseRepository;
    }

    @GetMapping
    public List<GeneDisease> getAllGeneDisease() {
        return geneDiseaseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneDisease> getGeneById(@PathVariable String id) {
        return geneDiseaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GeneDisease createGene(@RequestBody GeneDisease gene) {
        return geneDiseaseRepository.save(gene);
    }
}