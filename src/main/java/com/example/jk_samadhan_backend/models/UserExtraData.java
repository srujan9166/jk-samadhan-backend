package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_extra_data", schema = "jks_3nf", uniqueConstraints = {
    @UniqueConstraint(name = "uq_key_per_user", columnNames = {"user_id", "data_key"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserExtraData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "data_key", nullable = false, length = 100)
    private String dataKey;

    @Column(name = "data_value", nullable = false, columnDefinition = "TEXT")
    private String dataValue;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
