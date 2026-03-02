package com.phgdae.backend.Genes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GeneRepository extends JpaRepository<Gene, String> {
    Optional<Gene> findByGeneId(String geneId);
}
