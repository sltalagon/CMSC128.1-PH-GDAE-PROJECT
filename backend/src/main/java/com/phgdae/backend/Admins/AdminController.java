package com.phgdae.backend.Admins;

import com.phgdae.backend.Service.AdminService;
import com.phgdae.backend.enums.AdminRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
        String roleStr = payload.get("role");

        try {
            AdminRole role = AdminRole.valueOf(roleStr.toUpperCase());
            adminService.addAdmin(email, username, role);
            return ResponseEntity.ok("Admin added successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @DeleteMapping("/remove/{adminId}")
    public ResponseEntity<String> removeAdmin(@PathVariable UUID adminId) {
        try {
            adminService.removeAdmin(adminId);
            return ResponseEntity.ok("Admin removed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentAdmin(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> attributes = new HashMap<>(principal.getAttributes());

        String email = (String) attributes.get("email");
        adminService.findByEmail(email).ifPresent(admin -> {
            attributes.put("role", admin.getRole().name());
        });

        return ResponseEntity.ok(attributes);
    }
}