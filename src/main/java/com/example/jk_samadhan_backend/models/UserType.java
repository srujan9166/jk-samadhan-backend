package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_types", schema = "jks_3nf", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"type_name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type_name", nullable = false, length = 50)
    private String typeName;

    @Column(name = "user_level", nullable = false)
    private Integer userLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
