package com.phgdae.backend.Functional;

import jakarta.persistence.*;

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

    public FunctionalCategory(String categoryId, String categoryName, String description) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
    }

    // Getters
    public String getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getDescription() { return description; }

    // Setters
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setDescription(String description) { this.description = description; }
}