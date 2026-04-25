package com.phgdae.backend.Functional;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.phgdae.backend.GeneCategory.GeneCategory;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "functional_categories")
public class FunctionalCategory {

    public FunctionalCategory() {}

    @Id
    @Column(name = "category_id", length = 10)
    private String categoryId;

    @Column(name = "category_name", nullable = false, columnDefinition = "TEXT")
    private String categoryName;

    @Column(columnDefinition = "TEXT")
    private String description;

    // --- ADDED FOR CASCADING DELETES ---
    @OneToMany(mappedBy = "functionalCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<GeneCategory> geneCategories;
    // -----------------------------------

    public FunctionalCategory(String categoryId, String categoryName, String description) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
    }

    // Getters
    public String getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getDescription() { return description; }
    public List<GeneCategory> getGeneCategories() { return geneCategories; }

    // Setters
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setDescription(String description) { this.description = description; }
    public void setGeneCategories(List<GeneCategory> geneCategories) { this.geneCategories = geneCategories; }
}