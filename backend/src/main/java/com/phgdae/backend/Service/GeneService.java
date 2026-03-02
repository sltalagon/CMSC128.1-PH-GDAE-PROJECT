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
        long nextIdNumber = geneRepository.count() + 1;

        // Format as GXXX (e.g., G001, G002)
        String formattedId = String.format("G%03d", nextIdNumber);
        gene.setGeneId(formattedId);

        return geneRepository.save(gene);
    }
}