package com.phgdae.backend.GeneDisease;

import com.phgdae.backend.Service.GeneDiseaseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/genedisease")
public class GeneDiseaseController {

    private final GeneDiseaseService geneDiseaseService;
    private final GeneDiseaseRepository geneDiseaseRepository;

    public GeneDiseaseController(GeneDiseaseService geneDiseaseService, GeneDiseaseRepository geneDiseaseRepository) {
        this.geneDiseaseService = geneDiseaseService;
        this.geneDiseaseRepository = geneDiseaseRepository;
    }

    @GetMapping
    public List<GeneDisease> getAllGeneDisease() {
        return geneDiseaseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneDisease> getGeneDiseaseById(@PathVariable String id) {
        return geneDiseaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GeneDisease createGeneDisease(@RequestBody GeneDisease geneDisease) {
        return geneDiseaseService.saveGeneDisease(geneDisease);
    }
}