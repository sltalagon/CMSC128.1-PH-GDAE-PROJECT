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
                case GENE: {
                    Gene gene = new Gene();
                    gene.setGeneSymbol((String) data.get("geneSymbol"));
                    gene.setFullGeneName((String) data.get("fullGeneName"));
                    gene.setGeneType(parseEnum(GeneType.class, data.get("geneType")));
                    gene.setDescription((String) data.get("description"));
                    gene.setOmimId(parseBigDecimal(data.get("omimId")));

                    geneService.saveGene(gene); // Will throw exception if symbol exists
                    break;
                }
                case DISEASE: {
                    Disease disease = new Disease();
                    disease.setDiseaseName((String) data.get("diseaseName"));
                    disease.setDiseaseCategory(parseEnum(DiseaseCategory.class, data.get("diseaseCategory")));
                    disease.setInheritancePattern((String) data.get("inheritancePattern"));
                    disease.setPhPrevalence(parseEnum(Prevalence.class, data.get("phPrevalence")));
                    disease.setDescription((String) data.get("description"));
                    disease.setOmimId(parseBigDecimal(data.get("omimId")));

                    diseaseService.saveDisease(disease); // Will throw exception if name exists
                    break;
                }
                case ASSOCIATION: {
                    GeneDisease geneDisease = new GeneDisease();
                    Gene gene = geneService.getGeneById((String) data.get("geneId"));
                    Disease disease = diseaseService.getDiseaseById((String) data.get("diseaseId"));

                    geneDisease.setGene(gene);
                    geneDisease.setDisease(disease);
                    geneDisease.setAssociationType(parseEnum(AssociationType.class, data.get("associationType")));

                    List<Map<String, String>> references = null;
                    if (data.containsKey("references")) {
                        references = (List<Map<String, String>>) data.get("references");
                    }

                    if (references != null && !references.isEmpty()) {
                        geneDisease.setCitationUrl(references.get(0).get("url"));
                        geneDisease.setCitationDescription(references.get(0).get("description"));
                    }

                    // Will throw exception if exact pairing link is already registered
                    GeneDisease savedGd = geneDiseaseService.saveGeneDisease(geneDisease);

                    if (references != null) {
                        for (Map<String, String> refMap : references) {
                            String url = refMap.get("url");
                            if (url == null || url.trim().isEmpty()) continue;

                            Reference refToLink = referenceService.getReferenceByUrl(url);

                            if (refToLink == null) {
                                Reference newRef = new Reference();
                                newRef.setTitle(refMap.get("title"));
                                newRef.setUrl(url);
                                newRef.setDescription(refMap.get("description"));
                                refToLink = referenceService.saveReference(newRef);
                            }

                            if (refToLink != null) {
                                try {
                                    referenceService.linkGeneDiseaseToReference(savedGd.getGeneDiseaseId(), refToLink.getReferenceId());
                                } catch (Exception ignored) {
                                }
                            }
                        }
                    }
                    break;
                }
                case FUNCTIONAL_CATEGORY: {
                    FunctionalCategory category = new FunctionalCategory();
                    category.setCategoryName((String) data.get("categoryName"));
                    category.setDescription((String) data.get("description"));

                    functionalCategoryService.saveFunctionalCategory(category); // Will validate uniqueness
                    break;
                }
                case GENE_CATEGORY: {
                    GeneCategory geneCategory = new GeneCategory();
                    Gene gene = geneService.getGeneById((String) data.get("geneId"));
                    FunctionalCategory category = functionalCategoryService.getFunctionalCategoryById((String) data.get("categoryId"));

                    geneCategory.setGene(gene);
                    geneCategory.setFunctionalCategory(category);

                    geneCategoryService.saveGeneCategory(geneCategory); // Will validate uniqueness
                    break;
                }
                case REFERENCE: {
                    String url = (String) data.get("url");
                    if (url != null && !url.trim().isEmpty()) {
                        // 1. Check if the URL exists globally
                        Reference refToLink = referenceService.getReferenceByUrl(url);
                        boolean isExistingReference = (refToLink != null);

                        // 2. If it doesn't exist, create it
                        if (!isExistingReference) {
                            Reference newRef = new Reference();
                            newRef.setTitle((String) data.get("title"));
                            newRef.setUrl(url);
                            newRef.setDescription((String) data.get("description"));
                            refToLink = referenceService.saveReference(newRef);
                        }

                        // 3. Handle the Association Link
                        String geneDiseaseId = (String) data.get("geneDiseaseId");
                        if (geneDiseaseId != null && !geneDiseaseId.trim().isEmpty()) {
                            // If this specific link already exists, linkGeneDiseaseToReference will throw
                            // an IllegalArgumentException which bubbles right to your dashboard!
                            referenceService.linkGeneDiseaseToReference(geneDiseaseId, refToLink.getReferenceId());
                        } else if (isExistingReference) {
                            // If they suggested a standalone reference (no association) that is already in the DB
                            throw new IllegalArgumentException("This standalone reference URL already exists in the database.");
                        }
                    }
                    break;
                }
                default:
                    throw new IllegalArgumentException("Unknown suggestion type: " + suggestion.getSuggestionType());
            }
        } catch (IllegalArgumentException e) {
            // FIX: Bubble up validation messages directly so they are caught by your REST controller layout
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process approved suggestion: " + e.getMessage(), e);
        }
    }

    private BigDecimal parseBigDecimal(Object value) {
        if (value == null) return null;
        String strVal = value.toString().trim();
        if (strVal.isEmpty()) return null;
        return new BigDecimal(strVal);
    }

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