package com.phgdae.backend.Service;

import com.phgdae.backend.Admins.Admin;
import com.phgdae.backend.Admins.AdminRepository;
import com.phgdae.backend.enums.AdminRole;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminService {

    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void removeAdmin(UUID adminId) {
        if (!adminRepository.existsById(adminId)) {
            throw new IllegalArgumentException("Admin not found.");
        }
        adminRepository.deleteById(adminId);
    }

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public void addAdmin(String email, String username, AdminRole role) {
        if (adminRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An admin with this email is already registered.");
        }

        Admin newAdmin = new Admin();
        newAdmin.setEmail(email);
        newAdmin.setUsername(username);
        newAdmin.setRole(role);

        adminRepository.save(newAdmin);
    }
}