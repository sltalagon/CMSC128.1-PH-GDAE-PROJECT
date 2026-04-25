package com.phgdae.backend.Admins;

import com.phgdae.backend.Service.AdminService;
import com.phgdae.backend.enums.AdminRole;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<String> removeAdmin(@PathVariable("adminId") UUID adminId) {
        try {
            adminService.removeAdmin(adminId);
            return ResponseEntity.ok("Admin removed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Map<String, Object> response = new HashMap<>();
        response.put("email", email);

        adminService.findByEmail(email).ifPresent(admin -> {
            response.put("role", admin.getRole().name());
            response.put("username", admin.getUsername()); 
        });

        return ResponseEntity.ok(response);
    }
}