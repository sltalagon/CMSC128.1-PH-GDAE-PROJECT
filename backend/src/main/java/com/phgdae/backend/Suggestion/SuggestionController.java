package com.phgdae.backend.Suggestion;

import com.phgdae.backend.Service.SuggestionService;
import com.phgdae.backend.enums.SuggestionStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final SuggestionService suggestionService;

    public SuggestionController(SuggestionService suggestionService) {
        this.suggestionService = suggestionService;
    }

    // Public — anyone can submit
    @PostMapping
    public Suggestion createSuggestion(@RequestBody Suggestion suggestion) {
        return suggestionService.saveSuggestion(suggestion);
    }

    // Admin only
    @GetMapping
    public List<Suggestion> getAllSuggestions() {
        return suggestionService.getAllSuggestions();
    }

    @GetMapping("/pending")
    public List<Suggestion> getPendingSuggestions() {
        return suggestionService.getPendingSuggestions();
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<Suggestion> reviewSuggestion(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> payload) {
        try {
            SuggestionStatus status = SuggestionStatus.valueOf(payload.get("status").toUpperCase());
            String adminNotes = payload.getOrDefault("adminNotes", "");
            return ResponseEntity.ok(suggestionService.reviewSuggestion(id, status, adminNotes));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}