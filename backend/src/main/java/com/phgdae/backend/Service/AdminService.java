package com.phgdae.backend.Service;

import com.phgdae.backend.Admins.Admin;
import com.phgdae.backend.Admins.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;

    // 1. CREATE ADMIN (Hashing the password before saving)
    public Admin registerAdmin(String username, String rawPassword) {
        Admin admin = new Admin();
        admin.setUsername(username);

        // Transform "password123" -> "$2a$10$vI8.356..."
        String encodedPassword = passwordEncoder.encode(rawPassword);
        admin.setPasswordHash(encodedPassword);

        return adminRepository.save(admin);
    }

    // 2. LOGIN (Comparing raw input to the stored hash)
    public boolean login(String username, String rawPassword) {
        return adminRepository.findByUsername(username)
                .map(admin -> passwordEncoder.matches(rawPassword, admin.getPasswordHash()))
                .orElse(false);
    }
}