package com.phgdae.backend.Disease;

import com.opencsv.CSVReader;
import com.phgdae.backend.enums.DiseaseCategory;
import com.phgdae.backend.enums.Prevalence;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DiseaseSeeder implements CommandLineRunner {

    private final DiseaseRepository diseaseRepository;

    public DiseaseSeeder(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (diseaseRepository.count() > 0) {
            System.out.println("Diseases already seeded. Skipping.");
            return;
        }

        List<Disease> diseases = new ArrayList<>();

        ClassPathResource resource = new ClassPathResource("data/diseases.csv");

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] line;
            boolean isHeader = true;

            while ((line = reader.readNext()) != null) {
                // Skip header row
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                String diseaseId        = line[0].trim();
                String diseaseName      = line[1].trim();
                DiseaseCategory category = mapCategory(line[2].trim());
                String inheritancePattern = line[3].trim();
                BigDecimal omimId       = new BigDecimal(line[4].trim());
                String description      = line[5].trim();

                // ph_prevalence is not in your CSV so we derive it or default to NONE
                Prevalence prevalence = derivePrevalence(diseaseName);

                diseases.add(new Disease(
                    diseaseId,
                    diseaseName,
                    category,
                    inheritancePattern,
                    omimId,
                    prevalence,
                    description
                ));
            }
        }

        diseaseRepository.saveAll(diseases);
        System.out.println("✅ Seeded " + diseases.size() + " diseases from CSV.");
    }

    // Maps CSV string values to your DiseaseCategory enum
    private DiseaseCategory mapCategory(String value) {
        return switch (value.toLowerCase()) {
            case "metabolic"        -> DiseaseCategory.METABOLIC;
            case "neurological"     -> DiseaseCategory.NEUROLOGICAL;
            case "neuromuscular"    -> DiseaseCategory.NEUROMUSCULAR;
            case "cancer"           -> DiseaseCategory.CANCER;
            case "hematologic"      -> DiseaseCategory.HEMATOLOGIC;
            case "cardiovascular"   -> DiseaseCategory.CARDIOVASCULAR;
            case "renal"            -> DiseaseCategory.RENAL;
            case "dermatologic"     -> DiseaseCategory.DERMATOLOGICAL;
            case "syndromic"        -> DiseaseCategory.SYNDROMIC;
            default                 -> DiseaseCategory.ETC;
        };
    }

    // Since ph_prevalence is absent from the CSV, derive it or default to NONE
    // You can update these manually in the DB later, or add a column to your CSV
    private Prevalence derivePrevalence(String diseaseName) {
        String name = diseaseName.toLowerCase();
        if (name.contains("thalassemia") || name.contains("g6pd") ||
            name.contains("diabetes")    || name.contains("breast cancer") ||
            name.contains("nasopharyngeal") || name.contains("lupus") ||
            name.contains("hypothyroidism")) {
            return Prevalence.HIGH;
        } else if (name.contains("hemophilia") || name.contains("duchenne") ||
                   name.contains("hypercholesterolemia") || name.contains("down") ||
                   name.contains("neurofibromatosis") || name.contains("polycystic") ||
                   name.contains("colorectal") || name.contains("dystonia")) {
            return Prevalence.MEDIUM;
        } else {
            return Prevalence.LOW;
        }
    }
}