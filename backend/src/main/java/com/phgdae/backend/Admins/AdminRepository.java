package com.phgdae.backend.Admins;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {

    Optional<Admin> findByUsername(String username);
    boolean existsByUsername(String username);

    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);
}