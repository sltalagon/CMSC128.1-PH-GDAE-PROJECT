package com.phgdae.backend.Disease;

import com.phgdae.backend.enums.DiseaseCategory;
import com.phgdae.backend.enums.Prevalence;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "diseases")
@NoArgsConstructor
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
    @Column(name = "ph_prevalence")
    private Prevalence phPrevalence;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    public Disease(String diseaseId, String diseaseName, DiseaseCategory diseaseCategory,
                   String inheritancePattern, BigDecimal omimId, Prevalence phPrevalence, String description) {
        this.diseaseId = diseaseId;
        this.diseaseName = diseaseName;
        this.diseaseCategory = diseaseCategory;
        this.inheritancePattern = inheritancePattern;
        this.omimId = omimId;
        this.phPrevalence = phPrevalence;
        this.description = description;
    }

    // Getters
    public String getDiseaseId() { return diseaseId; }
    public String getDiseaseName() { return diseaseName; }
    public DiseaseCategory getDiseaseCategory() { return diseaseCategory; }
    public String getInheritancePattern() { return inheritancePattern; }
    public BigDecimal getOmimId() { return omimId; }
    public Prevalence getPhPrevalence() { return phPrevalence; }
    public String getDescription() { return description; }

    // Setters
    public void setDiseaseId(String diseaseId) { this.diseaseId = diseaseId; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }
    public void setDiseaseCategory(DiseaseCategory diseaseCategory) { this.diseaseCategory = diseaseCategory; }
    public void setInheritancePattern(String inheritancePattern) { this.inheritancePattern = inheritancePattern; }
    public void setOmimId(BigDecimal omimId) { this.omimId = omimId; }
    public void setPhPrevalence(Prevalence phPrevalence) { this.phPrevalence = phPrevalence; }
    public void setDescription(String description) { this.description = description; }
}