package com.phgdae.backend.Genes;

import com.phgdae.backend.enums.GeneType;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "genes")
@NoArgsConstructor
public class Gene {

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

    // Setters
    public void setGeneId(String geneId) { this.geneId = geneId; }
    public void setGeneSymbol(String geneSymbol) { this.geneSymbol = geneSymbol; }
    public void setFullGeneName(String fullGeneName) { this.fullGeneName = fullGeneName; }
    public void setGeneType(GeneType geneType) { this.geneType = geneType; }
    public void setOmimId(BigDecimal omimId) { this.omimId = omimId; }
    public void setNcbiId(String ncbiId) { this.ncbiId = ncbiId; }
    public void setDescription(String description) { this.description = description; }
}