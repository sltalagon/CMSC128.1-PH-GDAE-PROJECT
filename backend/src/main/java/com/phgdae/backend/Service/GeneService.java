package com.phgdae.backend.Service;

import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Genes.GeneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GeneService {

    private final GeneRepository geneRepository;

    public GeneService(GeneRepository geneRepository) {
        this.geneRepository = geneRepository;
    }

    @Transactional
    public Gene saveGene(Gene gene) {
        String maxId = geneRepository.findTopByOrderByGeneIdDesc()
                .map(Gene::getGeneId)
                .orElse("G000");

        int nextIdNumber = Integer.parseInt(maxId.substring(1)) + 1;
        gene.setGeneId(String.format("G%03d", nextIdNumber));

        return geneRepository.save(gene);
    }
}