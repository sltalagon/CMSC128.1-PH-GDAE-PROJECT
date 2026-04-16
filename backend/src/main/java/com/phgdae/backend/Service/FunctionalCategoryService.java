package com.phgdae.backend.Service;

import com.phgdae.backend.Functional.FunctionalCategory;
import com.phgdae.backend.Functional.FunctionalCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FunctionalCategoryService {

    private final FunctionalCategoryRepository functionalCategoryRepository;

    public FunctionalCategoryService(FunctionalCategoryRepository functionalCategoryRepository) {
        this.functionalCategoryRepository = functionalCategoryRepository;
    }

    @Transactional
    public FunctionalCategory saveFunctionalCategory(FunctionalCategory functionalCategory) {
        String maxId = functionalCategoryRepository.findTopByOrderByCategoryIdDesc()
                .map(FunctionalCategory::getCategoryId)
                .orElse("FC000");

        int nextIdNumber = Integer.parseInt(maxId.substring(2)) + 1;
        functionalCategory.setCategoryId(String.format("FC%03d", nextIdNumber));

        return functionalCategoryRepository.save(functionalCategory);
    }

    public FunctionalCategory getFunctionalCategoryById(String id) {
        return functionalCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Functional Category not found with ID: " + id));
    }
}
