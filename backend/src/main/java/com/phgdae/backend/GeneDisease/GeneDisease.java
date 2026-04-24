package com.phgdae.backend.GeneDisease;

import com.phgdae.backend.Disease.Disease;
import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.enums.AssociationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gene_disease_associations")
@NoArgsConstructor
@AllArgsConstructor
public class GeneDisease {

    @Id
    @Column(name = "gene_disease_id", length = 10)
    private String geneDiseaseId;

    @ManyToOne
    @JoinColumn(name = "gene_id", nullable = false)
    private Gene gene;

    @ManyToOne
    @JoinColumn(name = "disease_id", nullable = false)
    private Disease disease;

    @Enumerated(EnumType.STRING)
    @Column(name = "association_type", nullable = false)
    private AssociationType associationType;

    @Column(name = "citation_description", columnDefinition = "TEXT")
    private String citationDescription;

    @Column(name = "citation_url", nullable = false)
    private String citationUrl;

    // Getters
    public String getGeneDiseaseId() { return geneDiseaseId; }
    public Gene getGene() { return gene; }
    public Disease getDisease() { return disease; }
    public AssociationType getAssociationType() { return associationType; }
    public String getCitationDescription() { return citationDescription; }
    public String getCitationUrl() { return citationUrl; }

    // Setters
    public void setGeneDiseaseId(String geneDiseaseId) { this.geneDiseaseId = geneDiseaseId; }
    public void setGene(Gene gene) { this.gene = gene; }
    public void setDisease(Disease disease) { this.disease = disease; }
    public void setAssociationType(AssociationType associationType) { this.associationType = associationType; }
    public void setCitationDescription(String citationDescription) { this.citationDescription = citationDescription; }
    public void setCitationUrl(String citationUrl) { this.citationUrl = citationUrl; }
}