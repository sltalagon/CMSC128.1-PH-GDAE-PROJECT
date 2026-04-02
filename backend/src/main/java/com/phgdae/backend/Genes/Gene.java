package com.phgdae.backend.Genes;

import com.phgdae.backend.enums.GeneType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Gene {

    @Id
    @Column(name = "gene_id", length = 10)
    // Constraint: GXXX format, Not Null, PK, Unique
    private String geneId;

    @Column(name = "gene_symbol", nullable = false, unique = true)
    // Constraint: AlphaNumeric, Not Null, Unique
    private String geneSymbol;

    @Column(name = "full_gene_name", nullable = false, unique = true)
    // Constraint: AlphaNumeric, Not Null, Unique
    private String fullGeneName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gene_type", nullable = false)
    // Constraint: ENUM (protein-coding, non-coding)
    private GeneType geneType;

    @Column(name = "omim_id", nullable = false, unique = true)
    // Constraint: Decimal, Not Null, Unique
    private java.math.BigDecimal omimId;

    @Column(name = "ncbi_id", unique = true)
    private String ncbiId;

    @Column(name = "description", columnDefinition = "TEXT")
    // Constraint: Can be null
    private String description;

}