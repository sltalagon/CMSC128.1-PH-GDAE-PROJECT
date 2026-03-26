package com.phgdae.backend.Admins;

import com.phgdae.backend.enums.AdminRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner initDatabase(AdminRepository repository) {
        return args -> {
            if (!repository.existsByEmail("sltalagon@up.edu.ph")) {
                Admin superAdmin = new Admin();
                superAdmin.setEmail("sltalagon@up.edu.ph");
                superAdmin.setUsername("sltalagon");
                superAdmin.setRole(AdminRole.SUPER_ADMIN);
                repository.save(superAdmin);
                System.out.println("Seeded Admin: sltalagon@up.edu.ph");
            }

            if (!repository.existsByEmail("nccifra@up.edu.ph")) {
                Admin admin2 = new Admin();
                admin2.setEmail("nccifra@up.edu.ph");
                admin2.setUsername("nccifra");
                admin2.setRole(AdminRole.SUPER_ADMIN);
                repository.save(admin2);
                System.out.println("Seeded Admin: nccifra@up.edu.ph");
            }

            if (!repository.existsByEmail("jstejada2@up.edu.ph")) {
                Admin admin3 = new Admin();
                admin3.setEmail("jstejada2@up.edu.ph");
                admin3.setUsername("jstejada2");
                admin3.setRole(AdminRole.SUPER_ADMIN);
                repository.save(admin3);
                System.out.println("Seeded Admin: jstejada2@up.edu.ph");
            }
        };
    }
}