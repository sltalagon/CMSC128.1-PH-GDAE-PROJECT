package com.phgdae.backend.GeneDiseaseReference;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GeneDiseaseReferenceRepository extends JpaRepository<GeneDiseaseReference, Long> {
    List<GeneDiseaseReference> findByGeneDisease_GeneDiseaseId(String geneDiseaseId);
    List<GeneDiseaseReference> findByReference_ReferenceId(String referenceId);
    boolean existsByGeneDisease_GeneDiseaseIdAndReference_ReferenceId(String geneDiseaseId, String referenceId);
    void deleteByGeneDisease_GeneDiseaseIdAndReference_ReferenceId(String geneDiseaseId, String referenceId);
}