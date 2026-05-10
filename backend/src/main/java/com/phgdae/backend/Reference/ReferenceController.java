package com.phgdae.backend.Reference;

import com.phgdae.backend.GeneDiseaseReference.GeneDiseaseReference;
import com.phgdae.backend.Service.ReferenceService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/references")
public class ReferenceController {

    private final ReferenceService referenceService;
    private final ReferenceRepository referenceRepository;

    public ReferenceController(ReferenceService referenceService, ReferenceRepository referenceRepository) {
        this.referenceService = referenceService;
        this.referenceRepository = referenceRepository;
    }

    // --- CRUD ---

    @GetMapping
    public List<Reference> getAllReferences() {
        return referenceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reference> getReferenceById(@PathVariable("id") String id) {
        return referenceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createReference(@RequestBody Reference reference) {
        try {
            Reference saved = referenceService.saveReference(reference);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409)
                    .body(Map.of("message", "A reference with this URL or ID already exists."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReference(@PathVariable("id") String id, @RequestBody Reference referenceDetails) {
        return referenceRepository.findById(id).map(existing -> {
            existing.setTitle(referenceDetails.getTitle());
            existing.setUrl(referenceDetails.getUrl());
            existing.setDescription(referenceDetails.getDescription());
            referenceRepository.save(existing);
            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReference(@PathVariable("id") String id) {
        if (referenceRepository.existsById(id)) {
            referenceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- GeneDisease <-> Reference ---

    @GetMapping("/genedisease/{geneDiseaseId}")
    public List<GeneDiseaseReference> getReferencesForGeneDisease(@PathVariable String geneDiseaseId) {
        return referenceService.getReferencesForGeneDisease(geneDiseaseId);
    }

    @PostMapping("/genedisease/{geneDiseaseId}/{referenceId}")
    public ResponseEntity<?> linkGeneDiseaseToReference(@PathVariable String geneDiseaseId, @PathVariable String referenceId) {
        try {
            GeneDiseaseReference link = referenceService.linkGeneDiseaseToReference(geneDiseaseId, referenceId);
            return ResponseEntity.ok(link);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/genedisease/{geneDiseaseId}/{referenceId}")
    @Transactional
    public ResponseEntity<Void> unlinkGeneDiseaseFromReference(@PathVariable String geneDiseaseId, @PathVariable String referenceId) {
        referenceService.unlinkGeneDiseaseFromReference(geneDiseaseId, referenceId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{referenceId}/genedisease")
    public List<GeneDiseaseReference> getGeneDiseasesForReference(@PathVariable String referenceId) {
        return referenceService.getGeneDiseasesForReference(referenceId);
    }

}