package com.phgdae.backend.Functional;

import com.opencsv.CSVReader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(2)
public class FunctionalCategorySeeder implements CommandLineRunner {

    private final FunctionalCategoryRepository functionalCategoryRepository;

    public FunctionalCategorySeeder(FunctionalCategoryRepository functionalCategoryRepository) {
        this.functionalCategoryRepository = functionalCategoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (functionalCategoryRepository.count() > 0) {
            System.out.println("Functional categories already seeded. Skipping.");
            return;
        }

        List<FunctionalCategory> categories = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/functional_categories.csv");

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] line;
            boolean isHeader = true;

            while ((line = reader.readNext()) != null) {
                if (isHeader) { isHeader = false; continue; }

                String categoryId   = line[0].trim();
                String categoryName = line[1].trim();
                String description  = line[2].trim();

                categories.add(new FunctionalCategory(categoryId, categoryName, description));
            }
        }

        functionalCategoryRepository.saveAll(categories);
        System.out.println("✅ Seeded " + categories.size() + " functional categories from CSV.");
    }
}