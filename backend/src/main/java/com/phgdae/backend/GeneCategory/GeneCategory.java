package com.phgdae.backend.GeneCategory;

import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Functional.FunctionalCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "gene_categories")
public class GeneCategory {

    public GeneCategory() {}

    @Id
    @Column(name = "gene_category_id", length = 10)
    private String geneCategoryId;

    @ManyToOne
    @JoinColumn(name = "gene_id", nullable = false)
    private Gene gene;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private FunctionalCategory functionalCategory;

    public GeneCategory(String geneCategoryId, Gene gene, FunctionalCategory functionalCategory) {
        this.geneCategoryId = geneCategoryId;
        this.gene = gene;
        this.functionalCategory = functionalCategory;
    }

    // Getters
    public String getGeneCategoryId() { return geneCategoryId; }
    public Gene getGene() { return gene; }
    public FunctionalCategory getFunctionalCategory() { return functionalCategory; }

    // Setters
    public void setGeneCategoryId(String geneCategoryId) { this.geneCategoryId = geneCategoryId; }
    public void setGene(Gene gene) { this.gene = gene; }
    public void setFunctionalCategory(FunctionalCategory functionalCategory) { this.functionalCategory = functionalCategory; }
}