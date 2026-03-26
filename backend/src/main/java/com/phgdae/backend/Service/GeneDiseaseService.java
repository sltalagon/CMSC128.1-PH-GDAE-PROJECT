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
        String maxId = geneDiseaseRepository.findTopByOrderByGeneDiseaseIdDesc()
                .map(GeneDisease::getGeneDiseaseId)
                .orElse("GDA000");

        int nextIdNumber = Integer.parseInt(maxId.substring(3)) + 1;
        geneDisease.setGeneDiseaseId(String.format("GDA%03d", nextIdNumber));

        return geneDiseaseRepository.save(geneDisease);
    }
}