package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_status", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apk_version", length = 50)
    private String apkVersion;

    @Column(length = 255)
    private String feedback;

    @Column(name = "feedback_description", columnDefinition = "TEXT")
    private String feedbackDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_inserted_by")
    private Users recordInsertedBy;

    @CreationTimestamp
    @Column(name = "record_inserted_on", updatable = false)
    private LocalDateTime recordInsertedOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id")
    private GrievanceMaster grievance;
}
