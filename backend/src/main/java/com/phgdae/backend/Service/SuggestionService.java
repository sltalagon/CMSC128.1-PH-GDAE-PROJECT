package com.phgdae.backend.Service;

import com.phgdae.backend.Disease.Disease;
import com.phgdae.backend.Functional.FunctionalCategory;
import com.phgdae.backend.GeneCategory.GeneCategory;
import com.phgdae.backend.GeneDisease.GeneDisease;
import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Suggestion.*;
import com.phgdae.backend.enums.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SuggestionService {

    private final SuggestionRepository suggestionRepository;
    private final GeneService geneService;
    private final DiseaseService diseaseService;
    private final GeneDiseaseService geneDiseaseService;
    private final FunctionalCategoryService functionalCategoryService;
    private final GeneCategoryService geneCategoryService;

    public SuggestionService(SuggestionRepository suggestionRepository, GeneService geneService, DiseaseService diseaseService, GeneDiseaseService geneDiseaseService, FunctionalCategoryService functionalCategoryService, GeneCategoryService geneCategoryService) {
        this.suggestionRepository = suggestionRepository;
        this.geneService = geneService;
        this.diseaseService = diseaseService;
        this.geneDiseaseService = geneDiseaseService;
        this.functionalCategoryService = functionalCategoryService;
        this.geneCategoryService = geneCategoryService;
    }

    @Transactional
    public Suggestion saveSuggestion(Suggestion suggestion) {
        String maxId = suggestionRepository.findTopByOrderBySuggestionIdDesc()
                .map(Suggestion::getSuggestionId)
                .orElse("SUG000");

        int nextIdNumber = Integer.parseInt(maxId.substring(3)) + 1;
        suggestion.setSuggestionId(String.format("SUG%03d", nextIdNumber));
        suggestion.setStatus(SuggestionStatus.PENDING);
        suggestion.setSubmittedAt(LocalDateTime.now());

        return suggestionRepository.save(suggestion);
    }

    @Transactional
    public Suggestion reviewSuggestion(String id, SuggestionStatus status, String adminNotes) {
        Suggestion suggestion = suggestionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Suggestion not found."));

        suggestion.setStatus(status);
        suggestion.setAdminNotes(adminNotes);
        suggestion.setReviewedAt(LocalDateTime.now());
        suggestionRepository.save(suggestion);

        // If approved, parse content and save to the appropriate table
        if (status == SuggestionStatus.APPROVED) {
            processApprovedSuggestion(suggestion);
        }

        return suggestion;
    }

    private void processApprovedSuggestion(Suggestion suggestion) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String content = suggestion.getContent();

            switch (suggestion.getSuggestionType()) {
                case GENE -> {
                    Map<String, Object> data = mapper.readValue(content, Map.class);
                    Gene gene = new Gene();
                    gene.setGeneSymbol((String) data.get("geneSymbol"));
                    gene.setFullGeneName((String) data.get("fullGeneName"));
                    gene.setGeneType(GeneType.valueOf((String) data.get("geneType")));
                    gene.setDescription((String) data.get("description"));
                    if (data.get("omimId") != null) {
                        gene.setOmimId(new BigDecimal(data.get("omimId").toString()));
                    }
                    geneService.saveGene(gene);
                }
                case DISEASE -> {
                    Map<String, Object> data = mapper.readValue(content, Map.class);
                    Disease disease = new Disease();
                    disease.setDiseaseName((String) data.get("diseaseName"));
                    disease.setDiseaseCategory(DiseaseCategory.valueOf((String) data.get("diseaseCategory")));
                    disease.setInheritancePattern((String) data.get("inheritancePattern"));
                    disease.setPhPrevalence(Prevalence.valueOf((String) data.get("phPrevalence")));
                    disease.setDescription((String) data.get("description"));
                    if (data.get("omimId") != null) {
                        disease.setOmimId(new BigDecimal(data.get("omimId").toString()));
                    }
                    diseaseService.saveDisease(disease);
                }
                case ASSOCIATION -> {
                    Map<String, Object> data = mapper.readValue(content, Map.class);
                    GeneDisease geneDisease = new GeneDisease();
                    Gene gene = new Gene();
                    gene.setGeneId((String) data.get("geneId"));
                    geneDisease.setGene(gene);
                    Disease disease = new Disease();
                    disease.setDiseaseId((String) data.get("diseaseId"));
                    geneDisease.setDisease(disease);
                    geneDisease.setAssociationType(AssociationType.valueOf((String) data.get("associationType")));
                    geneDisease.setCitationUrl((String) data.get("citationUrl"));
                    geneDisease.setCitationDescription((String) data.get("citationDescription"));
                    geneDiseaseService.saveGeneDisease(geneDisease);
                }
                case FUNCTIONAL_CATEGORY -> {
                    Map<String, Object> data = mapper.readValue(content, Map.class);
                    FunctionalCategory category = new FunctionalCategory();
                    category.setCategoryName((String) data.get("categoryName"));
                    category.setDescription((String) data.get("description"));
                    functionalCategoryService.saveFunctionalCategory(category);
                }
                case GENE_CATEGORY -> {
                    Map<String, Object> data = mapper.readValue(content, Map.class);
                    GeneCategory geneCategory = new GeneCategory();
                    Gene gene = new Gene();
                    gene.setGeneId((String) data.get("geneId"));
                    geneCategory.setGene(gene);
                    FunctionalCategory category = new FunctionalCategory();
                    category.setCategoryId((String) data.get("categoryId"));
                    geneCategory.setFunctionalCategory(category);
                    geneCategoryService.saveGeneCategory(geneCategory);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process approved suggestion: " + e.getMessage());
        }
    }


    public List<Suggestion> getAllSuggestions() {
        return suggestionRepository.findAll();
    }

    public List<Suggestion> getPendingSuggestions() {
        return suggestionRepository.findByStatus(SuggestionStatus.PENDING);
    }
}