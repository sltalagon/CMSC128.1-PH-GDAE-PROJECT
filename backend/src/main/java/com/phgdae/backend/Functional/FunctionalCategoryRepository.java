package com.phgdae.backend.Functional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FunctionalCategoryRepository extends JpaRepository<FunctionalCategory, String> {
        Optional<FunctionalCategory> findByCategoryId(String categoryId);
}

