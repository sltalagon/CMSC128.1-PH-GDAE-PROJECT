package com.phgdae.backend.Genes;

import com.opencsv.CSVReader;
import com.phgdae.backend.enums.GeneType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(1)
public class GeneSeeder implements CommandLineRunner {

    private final GeneRepository geneRepository;

    public GeneSeeder(GeneRepository geneRepository) {
        this.geneRepository = geneRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (geneRepository.count() > 0) {
            System.out.println("Genes already seeded. Skipping.");
            return;
        }

        List<Gene> genes = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/genes.csv");

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] line;
            boolean isHeader = true;

            while ((line = reader.readNext()) != null) {
                if (isHeader) { isHeader = false; continue; }

                String geneId       = line[0].trim();
                String geneSymbol   = line[1].trim();
                BigDecimal omimId   = new BigDecimal(line[2].trim());
                String fullGeneName = line[3].trim();
                GeneType geneType   = mapGeneType(line[4].trim());
                String description  = line[5].trim();

                genes.add(new Gene(geneId, geneSymbol, fullGeneName, geneType, omimId, null, description));
            }
        }

        geneRepository.saveAll(genes);
        System.out.println("✅ Seeded " + genes.size() + " genes from CSV.");
    }

    private GeneType mapGeneType(String value) {
        return switch (value.toLowerCase()) {
            case "protein-coding" -> GeneType.PROTEIN_CODING;
            case "non-coding"     -> GeneType.NON_CODING;
            default               -> GeneType.PROTEIN_CODING;
        };
    }
}