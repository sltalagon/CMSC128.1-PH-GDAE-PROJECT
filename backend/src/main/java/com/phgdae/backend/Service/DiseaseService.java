package com.phgdae.backend.Service;

import com.phgdae.backend.Disease.Disease;
import com.phgdae.backend.Disease.DiseaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    public DiseaseService(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    @Transactional
    public Disease saveDisease(Disease disease) {
        String maxId = diseaseRepository.findTopByOrderByDiseaseIdDesc()
                .map(Disease::getDiseaseId)
                .orElse("D000");

        int nextIdNumber = Integer.parseInt(maxId.substring(1)) + 1;
        disease.setDiseaseId(String.format("D%03d", nextIdNumber));

        return diseaseRepository.save(disease);
    }

    public Disease getDiseaseById(String id) {
        return diseaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Disease not found with ID: " + id));
    }
}
