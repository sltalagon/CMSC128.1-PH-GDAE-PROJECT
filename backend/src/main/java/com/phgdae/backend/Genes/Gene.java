package com.phgdae.backend.Genes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.phgdae.backend.GeneCategory.GeneCategory;
import com.phgdae.backend.GeneDisease.GeneDisease;
import com.phgdae.backend.enums.GeneType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "genes")
public class Gene {

    public Gene() {}

    @Id
    @Column(name = "gene_id", length = 10)
    private String geneId;

    @Column(name = "gene_symbol", nullable = false, unique = true)
    private String geneSymbol;

    @Column(name = "full_gene_name", nullable = false, unique = true)
    private String fullGeneName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gene_type", nullable = false)
    private GeneType geneType;

    @Column(name = "omim_id", nullable = false, unique = true)
    private BigDecimal omimId;

    @Column(name = "ncbi_id", unique = true)
    private String ncbiId;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // --- ADDED FOR CASCADING DELETES ---
    @OneToMany(mappedBy = "gene", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<GeneCategory> geneCategories;

    @OneToMany(mappedBy = "gene", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<GeneDisease> geneDiseases;
    // -----------------------------------

    public Gene(String geneId, String geneSymbol, String fullGeneName, GeneType geneType, BigDecimal omimId, String ncbiId, String description) {
        this.geneId = geneId;
        this.geneSymbol = geneSymbol;
        this.fullGeneName = fullGeneName;
        this.geneType = geneType;
        this.omimId = omimId;
        this.ncbiId = ncbiId;
        this.description = description;
    }

    // Getters
    public String getGeneId() { return geneId; }
    public String getGeneSymbol() { return geneSymbol; }
    public String getFullGeneName() { return fullGeneName; }
    public GeneType getGeneType() { return geneType; }
    public BigDecimal getOmimId() { return omimId; }
    public String getNcbiId() { return ncbiId; }
    public String getDescription() { return description; }
    public List<GeneCategory> getGeneCategories() { return geneCategories; }
    public List<GeneDisease> getGeneDiseases() { return geneDiseases; }

    // Setters
    public void setGeneId(String geneId) { this.geneId = geneId; }
    public void setGeneSymbol(String geneSymbol) { this.geneSymbol = geneSymbol; }
    public void setFullGeneName(String fullGeneName) { this.fullGeneName = fullGeneName; }
    public void setGeneType(GeneType geneType) { this.geneType = geneType; }
    public void setOmimId(BigDecimal omimId) { this.omimId = omimId; }
    public void setNcbiId(String ncbiId) { this.ncbiId = ncbiId; }
    public void setDescription(String description) { this.description = description; }
    public void setGeneCategories(List<GeneCategory> geneCategories) { this.geneCategories = geneCategories; }
    public void setGeneDiseases(List<GeneDisease> geneDiseases) { this.geneDiseases = geneDiseases; }
}