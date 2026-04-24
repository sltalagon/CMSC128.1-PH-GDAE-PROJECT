package com.phgdae.backend.GeneCategory;

import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Functional.FunctionalCategory;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gene_categories")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class GeneCategory {

    @Id
    @Column(name = "gene_category_id", length = 10) // Format: GCXXX
    private String geneCategoryId;

    @ManyToOne
    @JoinColumn(name = "gene_id", nullable = false) // FK to Gene
    private Gene gene;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false) // FK to FunctionalCategory
    private FunctionalCategory functionalCategory;

    public void setCitationUrl(String citationUrl) {
        this.citationUrl = citationUrl;
    }

    public void setCitationDescription(String citationDescription) {
        this.citationDescription = citationDescription;
    }
}