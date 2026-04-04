package com.phgdae.backend.GeneCategory;

import com.opencsv.CSVReader;
import com.phgdae.backend.Functional.FunctionalCategory;
import com.phgdae.backend.Functional.FunctionalCategoryRepository;
import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Genes.GeneRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(3)
public class GeneCategorySeeder implements CommandLineRunner {

    private final GeneCategoryRepository geneCategoryRepository;
    private final GeneRepository geneRepository;
    private final FunctionalCategoryRepository functionalCategoryRepository;

    public GeneCategorySeeder(GeneCategoryRepository geneCategoryRepository,
                               GeneRepository geneRepository,
                               FunctionalCategoryRepository functionalCategoryRepository) {
        this.geneCategoryRepository = geneCategoryRepository;
        this.geneRepository = geneRepository;
        this.functionalCategoryRepository = functionalCategoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (geneCategoryRepository.count() > 0) {
            System.out.println("Gene categories already seeded. Skipping.");
            return;
        }

        List<GeneCategory> geneCategories = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/gene_functional_associations.csv");

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] line;
            boolean isHeader = true;

            while ((line = reader.readNext()) != null) {
                if (isHeader) { isHeader = false; continue; }

                String geneCategoryId = line[0].trim();
                String geneId         = extractId(line[1]);
                String categoryId     = extractId(line[2]);

                Gene gene = geneRepository.findById(geneId).orElse(null);
                FunctionalCategory category = functionalCategoryRepository.findById(categoryId).orElse(null);

                if (gene == null || category == null) {
                    System.out.println("⚠️ Skipping " + geneCategoryId + " — gene or category not found.");
                    continue;
                }

                geneCategories.add(new GeneCategory(geneCategoryId, gene, category));
            }
        }

        geneCategoryRepository.saveAll(geneCategories);
        System.out.println("✅ Seeded " + geneCategories.size() + " gene-category links from CSV.");
    }

    // Extracts "G001" from "G001 (HBB)" or "FC003" from "FC003 (Structural Protein)*"
    private String extractId(String raw) {
        return raw.trim().split("\\s+")[0].replaceAll("[^A-Za-z0-9]", "");
    }
}