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
        long nextIdNumber = diseaseRepository.count() + 1;

        // Format as DXXX (e.g., D001, D002)
        String formattedId = String.format("D%03d", nextIdNumber);
        disease.setDiseaseId(formattedId);

        return diseaseRepository.save(disease);
    }
}