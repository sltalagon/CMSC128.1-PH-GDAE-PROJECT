package com.phgdae.backend.Suggestion;

import com.phgdae.backend.enums.SuggestionStatus;
import com.phgdae.backend.enums.SuggestionType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "suggestions")
public class Suggestion {

    public Suggestion() {}

    @Id
    @Column(name = "suggestion_id", length = 10)
    private String suggestionId;

    @Column(name = "submitter_email", nullable = false)
    private String submitterEmail;

    @Column(name = "submitter_name", nullable = false)
    private String submitterName;

    @Enumerated(EnumType.STRING)
    @Column(name = "suggestion_type", nullable = false)
    private SuggestionType suggestionType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "reference_url")
    private String referenceUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SuggestionStatus status;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public Suggestion(String suggestionId, String submitterEmail, String submitterName,
                      SuggestionType suggestionType, String content, String referenceUrl,
                      SuggestionStatus status, String adminNotes,
                      LocalDateTime submittedAt, LocalDateTime reviewedAt) {
        this.suggestionId = suggestionId;
        this.submitterEmail = submitterEmail;
        this.submitterName = submitterName;
        this.suggestionType = suggestionType;
        this.content = content;
        this.referenceUrl = referenceUrl;
        this.status = status;
        this.adminNotes = adminNotes;
        this.submittedAt = submittedAt;
        this.reviewedAt = reviewedAt;
    }

    // Getters
    public String getSuggestionId() { return suggestionId; }
    public String getSubmitterEmail() { return submitterEmail; }
    public String getSubmitterName() { return submitterName; }
    public SuggestionType getSuggestionType() { return suggestionType; }
    public String getContent() { return content; }
    public String getReferenceUrl() { return referenceUrl; }
    public SuggestionStatus getStatus() { return status; }
    public String getAdminNotes() { return adminNotes; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }

    // Setters
    public void setSuggestionId(String suggestionId) { this.suggestionId = suggestionId; }
    public void setSubmitterEmail(String submitterEmail) { this.submitterEmail = submitterEmail; }
    public void setSubmitterName(String submitterName) { this.submitterName = submitterName; }
    public void setSuggestionType(SuggestionType suggestionType) { this.suggestionType = suggestionType; }
    public void setContent(String content) { this.content = content; }
    public void setReferenceUrl(String referenceUrl) { this.referenceUrl = referenceUrl; }
    public void setStatus(SuggestionStatus status) { this.status = status; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}