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
    public ResponseEntity<?> reviewSuggestion(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> payload) {
        try {
            SuggestionStatus status = SuggestionStatus.valueOf(payload.get("status").toUpperCase());
            String adminNotes = payload.getOrDefault("adminNotes", "");

            // Returns the approved/rejected Suggestion object
            return ResponseEntity.ok(suggestionService.reviewSuggestion(id, status, adminNotes));

        } catch (IllegalArgumentException e) {
            // FIX: Returns the exact duplicate error message inside a JSON payload so api.js can read it
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));

        } catch (Exception e) {
            // Failsafe: Catches any other random crashes and sends a readable message
            return ResponseEntity.internalServerError().body(Map.of("message", "An unexpected server error occurred."));
        }
    }
}