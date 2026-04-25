package com.phgdae.backend.Disease;

import com.phgdae.backend.Service.DiseaseService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diseases")
public class DiseaseController {

    private final DiseaseService diseaseService;
    private final DiseaseRepository diseaseRepository;

    public DiseaseController(DiseaseService diseaseService, DiseaseRepository diseaseRepository) {
        this.diseaseService = diseaseService;
        this.diseaseRepository = diseaseRepository;
    }

    @GetMapping
    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disease> getDiseaseById(@PathVariable("id") String id) {
        return diseaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisease(@PathVariable("id") String id) {
        if (diseaseRepository.existsById(id)) {
            diseaseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDisease(@PathVariable("id") String id, @RequestBody Disease diseaseDetails) {
        return diseaseRepository.findById(id).map(existingDisease -> {
            existingDisease.setDiseaseName(diseaseDetails.getDiseaseName());
            existingDisease.setDiseaseCategory(diseaseDetails.getDiseaseCategory());
            existingDisease.setInheritancePattern(diseaseDetails.getInheritancePattern());
            existingDisease.setOmimId(diseaseDetails.getOmimId());
            existingDisease.setPhPrevalence(diseaseDetails.getPhPrevalence());
            existingDisease.setDescription(diseaseDetails.getDescription());

            diseaseRepository.save(existingDisease);
            return ResponseEntity.ok(existingDisease);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createDisease(@RequestBody Disease disease) {
        try {
            Disease saved = diseaseService.saveDisease(disease);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("message", "A disease with this name or ID already exists."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}