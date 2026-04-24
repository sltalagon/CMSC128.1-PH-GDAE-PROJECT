package com.phgdae.backend.GeneDisease;

import com.phgdae.backend.Disease.Disease;
import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.enums.AssociationType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gene_disease_associations")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class GeneDisease {

    @Id
    @Column(name = "gene_disease_id", length = 10) // Format: GDAXXX
    private String geneDiseaseId;

    @ManyToOne
    @JoinColumn(name = "gene_id", nullable = false) // FK to Gene
    private Gene gene;

    @ManyToOne
    @JoinColumn(name = "disease_id", nullable = false) // FK to Disease
    private Disease disease;

    @Enumerated(EnumType.STRING)
    @Column(name = "association_type", nullable = false) // ENUM: predisposition, driver, etc.
    private AssociationType associationType;

    @Column(name = "citation_description", columnDefinition = "TEXT") //
    private String citationDescription;

    @Column(name = "citation_url", nullable = false) //
    private String citationUrl;

    public void setGene(Gene gene) {
        this.gene = gene;
    }

    public void setCitationUrl(String citationUrl) {
        this.citationUrl = citationUrl;
    }

    public void setCitationDescription(String citationDescription) {
        this.citationDescription = citationDescription;
    }

}