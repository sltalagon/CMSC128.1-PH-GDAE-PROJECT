package com.phgdae.backend.GeneDisease;

import com.phgdae.backend.enums.AssociationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GeneDiseaseRepository extends JpaRepository<GeneDisease, String> {
    Optional<GeneDisease> findTopByOrderByGeneDiseaseIdDesc();
    boolean existsByGene_GeneIdAndDisease_DiseaseIdAndAssociationType(String geneId, String diseaseId, AssociationType associationType);
}


