package com.phgdae.backend.Suggestion;

import com.phgdae.backend.enums.SuggestionStatus;
import com.phgdae.backend.enums.SuggestionType;
import jakarta.persistence.*;
import lombok.*;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "suggestions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Suggestion {

    @Id
    @Column(name = "suggestion_id", length = 10)
    private String suggestionId;

    @Column(name = "submitter_email", nullable = false)
    private String submitterEmail;

    @Column(name = "submitter_name", nullable = false)
    private String submitterName;

    @Enumerated(EnumType.STRING)
    @Column(name = "suggestion_type", nullable = false) // GENE, DISEASE, ASSOCIATION, OTHER
    private SuggestionType suggestionType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "reference_url")
    private String referenceUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false) // PENDING, APPROVED, REJECTED
    private SuggestionStatus status;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

}