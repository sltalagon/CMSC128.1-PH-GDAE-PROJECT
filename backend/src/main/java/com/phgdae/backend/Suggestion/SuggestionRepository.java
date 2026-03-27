package com.phgdae.backend.Suggestion;

import com.phgdae.backend.enums.SuggestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, String> {
    Optional<Suggestion> findTopByOrderBySuggestionIdDesc();
    List<Suggestion> findByStatus(SuggestionStatus status);
}