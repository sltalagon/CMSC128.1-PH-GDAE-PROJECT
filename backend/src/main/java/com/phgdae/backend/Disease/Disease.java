package com.phgdae.backend.Disease;

import com.phgdae.backend.enums.DiseaseCategory;
import com.phgdae.backend.enums.Prevalence;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "diseases")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Disease {

    @Id
    @Column(name = "disease_id", length = 10)
    private String diseaseId;

    @Column(name = "disease_name", nullable = false, unique = true)
    private String diseaseName;

    @Enumerated(EnumType.STRING)
    @Column(name = "disease_category")
    private DiseaseCategory diseaseCategory;

    @Column(name = "inheritance_pattern", nullable = false)
    private String inheritancePattern;

    @Column(name = "omim_id", nullable = false, unique = true)
    private BigDecimal omimId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ph_prevalence") // ENUM: High, Medium, Low, None
    private Prevalence phPrevalence;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    public void setPhPrevalence(com.phgdae.backend.enums.Prevalence phPrevalence) {
        this.phPrevalence = phPrevalence;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOmimId(java.math.BigDecimal omimId) {
        this.omimId = omimId;
    }

}