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
    public FunctionalCategory saveDisease(FunctionalCategory functionalCategory) {
        long nextIdNumber = functionalCategoryRepository.count() + 1;

        // Format as FXXX (e.g., F001, F002)
        String formattedId = String.format("F%03d", nextIdNumber);
        functionalCategory.setCategoryId(formattedId);

        return functionalCategoryRepository.save(functionalCategory);
    }
}