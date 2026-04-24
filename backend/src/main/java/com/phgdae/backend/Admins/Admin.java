package com.phgdae.backend.Admins;

import com.phgdae.backend.enums.AdminRole;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "admin_id", updatable = false, nullable = false)
    private UUID adminId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminRole role;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    // Constructors
    public Admin() {}

    public Admin(UUID adminId, AdminRole role, String email, String username) {
        this.adminId = adminId;
        this.role = role;
        this.email = email;
        this.username = username;
    }

    // Getters
    public UUID getAdminId() { return adminId; }
    public AdminRole getRole() { return role; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }

    // Setters
    public void setAdminId(UUID adminId) { this.adminId = adminId; }
    public void setRole(AdminRole role) { this.role = role; }
    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
}