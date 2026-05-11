package com.phgdae.backend.Service;

import com.phgdae.backend.GeneDisease.GeneDisease;
import com.phgdae.backend.GeneDisease.GeneDiseaseRepository;
import com.phgdae.backend.GeneDiseaseReference.GeneDiseaseReference;
import com.phgdae.backend.GeneDiseaseReference.GeneDiseaseReferenceRepository;
import com.phgdae.backend.Reference.Reference;
import com.phgdae.backend.Reference.ReferenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReferenceService {

    private final ReferenceRepository referenceRepository;
    private final GeneDiseaseRepository geneDiseaseRepository;
    private final GeneDiseaseReferenceRepository geneDiseaseReferenceRepository;

    public ReferenceService(ReferenceRepository referenceRepository,
                            GeneDiseaseRepository geneDiseaseRepository,
                            GeneDiseaseReferenceRepository geneDiseaseReferenceRepository) {
        this.referenceRepository = referenceRepository;
        this.geneDiseaseRepository = geneDiseaseRepository;
        this.geneDiseaseReferenceRepository = geneDiseaseReferenceRepository;
    }

    @Transactional
    public Reference saveReference(Reference reference) {
        if (referenceRepository.existsByUrl(reference.getUrl())) {
            throw new IllegalArgumentException("A reference with this URL already exists.");
        }

        String maxId = referenceRepository.findTopByOrderByReferenceIdDesc()
                .map(Reference::getReferenceId)
                .orElse("R000");

        int nextIdNumber = Integer.parseInt(maxId.substring(1)) + 1;
        reference.setReferenceId(String.format("R%03d", nextIdNumber));

        return referenceRepository.save(reference);
    }

    // --- GeneDisease <-> Reference ---

    @Transactional
    public GeneDiseaseReference linkGeneDiseaseToReference(String geneDiseaseId, String referenceId) {
        if (geneDiseaseReferenceRepository.existsByGeneDisease_GeneDiseaseIdAndReference_ReferenceId(geneDiseaseId, referenceId)) {
            throw new IllegalArgumentException("This association is already linked to that reference.");
        }
        GeneDisease geneDisease = geneDiseaseRepository.findById(geneDiseaseId)
                .orElseThrow(() -> new IllegalArgumentException("GeneDisease association not found: " + geneDiseaseId));
        Reference reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("Reference not found: " + referenceId));
        return geneDiseaseReferenceRepository.save(new GeneDiseaseReference(geneDisease, reference));
    }

    @Transactional
    public void unlinkGeneDiseaseFromReference(String geneDiseaseId, String referenceId) {
        geneDiseaseReferenceRepository.deleteByGeneDisease_GeneDiseaseIdAndReference_ReferenceId(geneDiseaseId, referenceId);
    }

    public List<GeneDiseaseReference> getReferencesForGeneDisease(String geneDiseaseId) {
        return geneDiseaseReferenceRepository.findByGeneDisease_GeneDiseaseId(geneDiseaseId);
    }

    public List<GeneDiseaseReference> getGeneDiseasesForReference(String referenceId) {
        return geneDiseaseReferenceRepository.findByReference_ReferenceId(referenceId);
    }

    public Reference getReferenceByUrl(String url) {
        return referenceRepository.findByUrl(url).orElse(null);
    }
}