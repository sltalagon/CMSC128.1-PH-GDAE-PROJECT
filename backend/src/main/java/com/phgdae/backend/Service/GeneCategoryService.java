package com.phgdae.backend.Service;

import com.phgdae.backend.GeneCategory.GeneCategory;
import com.phgdae.backend.GeneCategory.GeneCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GeneCategoryService {

    private final GeneCategoryRepository geneCategoryRepository;

    public GeneCategoryService(GeneCategoryRepository geneCategoryRepository) {
        this.geneCategoryRepository = geneCategoryRepository;
    }

    @Transactional
    public GeneCategory saveGeneCategory(GeneCategory geneCategory) {
        String maxId = geneCategoryRepository.findTopByOrderByGeneCategoryIdDesc()
                .map(GeneCategory::getGeneCategoryId)
                .orElse("GC000");

        int nextIdNumber = Integer.parseInt(maxId.substring(2)) + 1;
        geneCategory.setGeneCategoryId(String.format("GC%03d", nextIdNumber));

        return geneCategoryRepository.save(geneCategory);
    }
}