package com.phgdae.backend.Service;

import com.phgdae.backend.Disease.Disease;
import com.phgdae.backend.Functional.FunctionalCategory;
import com.phgdae.backend.GeneCategory.GeneCategory;
import com.phgdae.backend.GeneDisease.GeneDisease;
import com.phgdae.backend.Genes.Gene;
import com.phgdae.backend.Reference.Reference;
import com.phgdae.backend.Suggestion.*;
import com.phgdae.backend.enums.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ReferenceService referenceService;

    public SuggestionService(SuggestionRepository suggestionRepository, GeneService geneService, DiseaseService diseaseService, GeneDiseaseService geneDiseaseService, FunctionalCategoryService functionalCategoryService, GeneCategoryService geneCategoryService, ReferenceService referenceService) {
        this.suggestionRepository = suggestionRepository;
        this.geneService = geneService;
        this.diseaseService = diseaseService;
        this.geneDiseaseService = geneDiseaseService;
        this.functionalCategoryService = functionalCategoryService;
        this.geneCategoryService = geneCategoryService;
        this.referenceService = referenceService;
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
            Map<String, Object> data = mapper.readValue(content, new TypeReference<Map<String, Object>>() {});

            switch (suggestion.getSuggestionType()) {
                case GENE -> {
                    Gene gene = new Gene();
                    gene.setGeneSymbol((String) data.get("geneSymbol"));
                    gene.setFullGeneName((String) data.get("fullGeneName"));
                    gene.setGeneType(parseEnum(GeneType.class, data.get("geneType")));
                    gene.setDescription((String) data.get("description"));
                    gene.setOmimId(parseBigDecimal(data.get("omimId")));
                    
                    geneService.saveGene(gene);
                }
                case DISEASE -> {
                    Disease disease = new Disease();
                    disease.setDiseaseName((String) data.get("diseaseName"));
                    disease.setDiseaseCategory(parseEnum(DiseaseCategory.class, data.get("diseaseCategory")));
                    disease.setInheritancePattern((String) data.get("inheritancePattern"));
                    disease.setPhPrevalence(parseEnum(Prevalence.class, data.get("phPrevalence")));
                    disease.setDescription((String) data.get("description"));
                    disease.setOmimId(parseBigDecimal(data.get("omimId")));
                    
                    diseaseService.saveDisease(disease);
                }
                case ASSOCIATION -> {
                    GeneDisease geneDisease = new GeneDisease();

                    // Fetch existing entities
                    Gene gene = geneService.getGeneById((String) data.get("geneId"));
                    Disease disease = diseaseService.getDiseaseById((String) data.get("diseaseId"));

                    geneDisease.setGene(gene);
                    geneDisease.setDisease(disease);
                    geneDisease.setAssociationType(parseEnum(AssociationType.class, data.get("associationType")));

                    // Safely extract the new references array
                    List<Map<String, String>> references = null;
                    if (data.containsKey("references")) {
                        references = (List<Map<String, String>>) data.get("references");
                    }

                    // Keep fallbacks populated just in case your backend entity still requires them
                    if (references != null && !references.isEmpty()) {
                        geneDisease.setCitationUrl(references.get(0).get("url"));
                        geneDisease.setCitationDescription(references.get(0).get("description"));
                    }

                    // 1. Save the base association first so we have its ID
                    GeneDisease savedGd = geneDiseaseService.saveGeneDisease(geneDisease);

                    // 2. Process and link the references!
                    if (references != null) {
                        for (Map<String, String> refMap : references) {
                            String url = refMap.get("url");
                            if (url == null || url.trim().isEmpty()) continue;

                            // FIX: Check if it exists FIRST to avoid poisoning the transaction!
                            Reference refToLink = referenceService.getReferenceByUrl(url);

                            if (refToLink == null) {
                                // If it doesn't exist, create and save it
                                Reference newRef = new Reference();
                                newRef.setTitle(refMap.get("title"));
                                newRef.setUrl(url);
                                newRef.setDescription(refMap.get("description"));
                                refToLink = referenceService.saveReference(newRef);
                            }

                            // 3. Link the reference to the GeneDisease Association
                            if (refToLink != null) {
                                try {
                                    referenceService.linkGeneDiseaseToReference(savedGd.getGeneDiseaseId(), refToLink.getReferenceId());
                                } catch (Exception ignored) {
                                    // It's safe to ignore if it's already linked
                                }
                            }
                        }
                    }
                }
                case FUNCTIONAL_CATEGORY -> {
                    FunctionalCategory category = new FunctionalCategory();
                    category.setCategoryName((String) data.get("categoryName"));
                    category.setDescription((String) data.get("description"));
                    
                    functionalCategoryService.saveFunctionalCategory(category);
                }
                case GENE_CATEGORY -> {
                    GeneCategory geneCategory = new GeneCategory();
                    
                    // Fetch existing entities
                    Gene gene = geneService.getGeneById((String) data.get("geneId"));
                    FunctionalCategory category = functionalCategoryService.getFunctionalCategoryById((String) data.get("categoryId"));
                    
                    geneCategory.setGene(gene);
                    geneCategory.setFunctionalCategory(category);
                    
                    geneCategoryService.saveGeneCategory(geneCategory);
                }
                case REFERENCE -> {
                    String url = (String) data.get("url");
                    if (url != null && !url.trim().isEmpty()) {
                        // Check if it already exists to prevent duplicates
                        Reference refToLink = referenceService.getReferenceByUrl(url);

                        if (refToLink == null) {
                            Reference newRef = new Reference();
                            newRef.setTitle((String) data.get("title"));
                            newRef.setUrl(url);
                            newRef.setDescription((String) data.get("description"));
                            refToLink = referenceService.saveReference(newRef);
                        }

                        // Link it to an association if the user selected one!
                        String geneDiseaseId = (String) data.get("geneDiseaseId");
                        if (geneDiseaseId != null && !geneDiseaseId.trim().isEmpty()) {
                            try {
                                referenceService.linkGeneDiseaseToReference(geneDiseaseId, refToLink.getReferenceId());
                            } catch (Exception ignored) {
                                // Ignore if already linked
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            // This will print the EXACT reason for the crash in your Spring Boot terminal
            e.printStackTrace(); 
            throw new RuntimeException("Failed to process approved suggestion: " + e.getMessage(), e);
        }
    }

    // --- HELPER METHODS FOR SAFE PARSING ---

    /**
     * Safely parses a BigDecimal, handling nulls and empty strings.
     */
    private BigDecimal parseBigDecimal(Object value) {
        if (value == null) return null;
        String strVal = value.toString().trim();
        if (strVal.isEmpty()) return null;
        return new BigDecimal(strVal);
    }

    /**
     * Safely parses an Enum, converting it to uppercase and replacing spaces/dashes with underscores.
     */
    private <T extends Enum<T>> T parseEnum(Class<T> enumType, Object value) {
        if (value == null) return null;
        String strVal = value.toString().trim().toUpperCase().replace(" ", "_").replace("-", "_");
        if (strVal.isEmpty()) return null;
        return Enum.valueOf(enumType, strVal);
    }

    public List<Suggestion> getAllSuggestions() {
        return suggestionRepository.findAll();
    }

    public List<Suggestion> getPendingSuggestions() {
        return suggestionRepository.findByStatus(SuggestionStatus.PENDING);
    }
}
