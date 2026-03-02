package com.phgdae.backend.Service;

import com.phgdae.backend.GeneDisease.GeneDisease;
import com.phgdae.backend.GeneDisease.GeneDiseaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GeneDiseaseService {

    private final GeneDiseaseRepository geneDiseaseRepository;

    public GeneDiseaseService(GeneDiseaseRepository geneDiseaseRepository) {
        this.geneDiseaseRepository = geneDiseaseRepository;
    }

    @Transactional
    public GeneDisease saveGeneDisease(GeneDisease geneDisease) {
        long nextIdNumber = geneDiseaseRepository.count() + 1;

        // Format as DXXX (e.g., D001, D002)
        String formattedId = String.format("GDA%03d", nextIdNumber);
        geneDisease.setGeneDiseaseId(formattedId);

        return geneDiseaseRepository.save(geneDisease);
    }
}