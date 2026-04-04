package com.phgdae.backend.GeneDisease;

import com.opencsv.CSVReader;
import com.phgdae.backend.Disease.Disease;
import com.phgdae.backend.Disease.DiseaseRepository;
import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Genes.GeneRepository;
import com.phgdae.backend.enums.AssociationType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(4)
public class GeneDiseaseSeeder implements CommandLineRunner {

    private final GeneDiseaseRepository geneDiseaseRepository;
    private final GeneRepository geneRepository;
    private final DiseaseRepository diseaseRepository;

    public GeneDiseaseSeeder(GeneDiseaseRepository geneDiseaseRepository,
                              GeneRepository geneRepository,
                              DiseaseRepository diseaseRepository) {
        this.geneDiseaseRepository = geneDiseaseRepository;
        this.geneRepository = geneRepository;
        this.diseaseRepository = diseaseRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (geneDiseaseRepository.count() > 0) {
            System.out.println("Gene-disease associations already seeded. Skipping.");
            return;
        }

        List<GeneDisease> associations = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/gene_disease_associations.csv");

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] line;
            boolean isHeader = true;

            while ((line = reader.readNext()) != null) {
                if (isHeader) { isHeader = false; continue; }

                String geneDiseaseId  = line[0].trim();
                String geneId         = extractId(line[1]);
                String diseaseId      = extractId(line[2]);
                AssociationType type  = mapAssociationType(line[3].trim());

                Gene gene = geneRepository.findById(geneId).orElse(null);
                Disease disease = diseaseRepository.findById(diseaseId).orElse(null);

                if (gene == null || disease == null) {
                    System.out.println("⚠️ Skipping " + geneDiseaseId + " — gene or disease not found.");
                    continue;
                }

                associations.add(new GeneDisease(geneDiseaseId, gene, disease, type, null, ""));
            }
        }

        geneDiseaseRepository.saveAll(associations);
        System.out.println("✅ Seeded " + associations.size() + " gene-disease associations from CSV.");
    }

    // Extracts "G001" from "G001 (HBB)" or "D001" from "D001 (Thalassemia)"
    private String extractId(String raw) {
        return raw.trim().split("\\s+")[0].replaceAll("[^A-Za-z0-9]", "");
    }

    private AssociationType mapAssociationType(String value) {
        return switch (value.toLowerCase()) {
            case "predisposition" -> AssociationType.PREDISPOSITION;
            case "driver"         -> AssociationType.DRIVER;
            case "somatic"        -> AssociationType.SOMATIC;
            case "germline"       -> AssociationType.GERMLINE;
            default               -> AssociationType.GERMLINE;
        };
    }
}