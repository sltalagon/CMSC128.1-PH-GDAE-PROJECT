package com.phgdae.backend.Service;

import com.phgdae.backend.Admins.Admin;
import com.phgdae.backend.Admins.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public void addAdmin(String email, String username) {
        if (adminRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An admin with this email is already registered.");
        }

        Admin newAdmin = new Admin();
        newAdmin.setEmail(email);
        newAdmin.setUsername(username);

        adminRepository.save(newAdmin);
    }
}