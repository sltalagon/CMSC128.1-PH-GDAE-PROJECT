package com.phgdae.backend.Functional;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "functional_categories")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FunctionalCategory {

    @Id
    @Column(name = "category_id", length = 10)
    private String categoryId;

    @Column(name = "category_name", nullable = false, columnDefinition = "TEXT")
    private String categoryName;

    @Column(columnDefinition = "TEXT")
    private String description;
}