package com.phgdae.backend.Reference;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReferenceRepository extends JpaRepository<Reference, String> {
    boolean existsByUrl(String url);
    Optional<Reference> findTopByOrderByReferenceIdDesc();
}