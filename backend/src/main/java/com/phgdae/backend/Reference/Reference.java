package com.phgdae.backend.Reference;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "references_list")
public class Reference {

    public Reference() {}

    @Id
    @Column(name = "reference_id", length = 10)
    private String referenceId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "url", nullable = false, unique = true, columnDefinition = "TEXT")
    private String url;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;


    public Reference(String referenceId, String title, String url, String description) {
        this.referenceId = referenceId;
        this.title = title;
        this.url = url;
        this.description = description;
    }

    // Getters
    public String getReferenceId() { return referenceId; }
    public String getTitle() { return title; }
    public String getUrl() { return url; }
    public String getDescription() { return description; }

    // Setters
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    public void setTitle(String title) { this.title = title; }
    public void setUrl(String url) { this.url = url; }
    public void setDescription(String description) { this.description = description; }
}