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
    public ResponseEntity<GeneDisease> getGeneDiseaseById(@PathVariable("id") String id) {
        return geneDiseaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGeneDisease(@PathVariable("id") String id) {
        if (geneDiseaseRepository.existsById(id)) {
            geneDiseaseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeneDisease> updateGeneDisease(@PathVariable("id") String id, @RequestBody GeneDisease associationDetails) {
        return geneDiseaseRepository.findById(id).map(existingAssociation -> {
            existingAssociation.setGene(associationDetails.getGene());
            existingAssociation.setDisease(associationDetails.getDisease());
            existingAssociation.setAssociationType(associationDetails.getAssociationType());
            existingAssociation.setCitationUrl(associationDetails.getCitationUrl());
            existingAssociation.setCitationDescription(associationDetails.getCitationDescription());

            geneDiseaseRepository.save(existingAssociation);
            return ResponseEntity.ok(existingAssociation);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GeneDisease createGeneDisease(@RequestBody GeneDisease geneDisease) {
        return geneDiseaseService.saveGeneDisease(geneDisease);
    }
}