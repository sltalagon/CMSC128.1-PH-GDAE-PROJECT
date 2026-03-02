package com.phgdae.backend.Admins;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "admins")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "admin_id", updatable = false, nullable = false)
    private UUID adminId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 60)
    private String passwordHash;
}
