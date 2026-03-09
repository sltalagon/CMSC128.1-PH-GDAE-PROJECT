package com.phgdae.backend.Admins;

import com.phgdae.backend.Service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addAdmin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String username = payload.get("username");
        
        try {
            adminService.addAdmin(email, username);
            return ResponseEntity.ok("Admin added successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentAdmin(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(principal.getAttributes());
    }
}