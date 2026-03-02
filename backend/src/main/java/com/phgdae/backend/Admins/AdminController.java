package com.phgdae.backend.Admins;

import com.phgdae.backend.Service.AdminService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Endpoint for creating an admin (e.g., initial setup)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AdminRegistrationRequest request) {
        adminService.registerAdmin(request.getUsername(), request.getPassword());
        return ResponseEntity.ok("Admin registered successfully");
    }

    // Endpoint for Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        boolean isAuthenticated = adminService.login(request.getUsername(), request.getPassword());

        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}