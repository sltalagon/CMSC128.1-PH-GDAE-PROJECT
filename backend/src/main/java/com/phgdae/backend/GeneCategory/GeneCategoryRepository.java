package com.phgdae.backend.GeneCategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GeneCategoryRepository extends JpaRepository<GeneCategory, String> {
    Optional<GeneCategory> findTopByOrderByGeneCategoryIdDesc();
}