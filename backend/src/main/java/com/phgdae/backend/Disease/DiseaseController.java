package com.phgdae.backend.Disease;

import com.phgdae.backend.Service.DiseaseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

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
    public ResponseEntity<Disease> getDiseaseById(@PathVariable String id) {
        return diseaseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Disease createDisease(@RequestBody Disease disease) {
        return diseaseService.saveDisease(disease);
    }
}