package com.phgdae.backend.GeneDiseaseReference;

import com.phgdae.backend.GeneDisease.GeneDisease;
import com.phgdae.backend.Reference.Reference;
import jakarta.persistence.*;

@Entity
@Table(name = "gene_disease_references")
public class GeneDiseaseReference {

    public GeneDiseaseReference() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gene_disease_id", nullable = false)
    private GeneDisease geneDisease;

    @ManyToOne
    @JoinColumn(name = "reference_id", nullable = false)
    private Reference reference;

    public GeneDiseaseReference(GeneDisease geneDisease, Reference reference) {
        this.geneDisease = geneDisease;
        this.reference = reference;
    }

    // Getters
    public Long getId() { return id; }
    public GeneDisease getGeneDisease() { return geneDisease; }
    public Reference getReference() { return reference; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setGeneDisease(GeneDisease geneDisease) { this.geneDisease = geneDisease; }
    public void setReference(Reference reference) { this.reference = reference; }
}