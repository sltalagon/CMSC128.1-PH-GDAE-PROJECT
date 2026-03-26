package com.phgdae.backend.Admins;

import com.phgdae.backend.enums.AdminRole;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminRole role;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

}       