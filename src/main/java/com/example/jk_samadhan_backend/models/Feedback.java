package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id", nullable = false)
    private GrievanceMaster grievance;

    @Column(length = 50)
    private String satisfied;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "call_received", length = 50)
    private String callReceived;

    @Column(name = "overall_experience", length = 50)
    private String overallExperience;

    @Column(name = "poor_reason", columnDefinition = "TEXT")
    private String poorReason;

    @Column(name = "time_satisfaction", length = 50)
    private String timeSatisfaction;

    @Column(name = "reuse_portal", length = 50)
    private String reusePortal;

    @Column(name = "rating1")
    private Integer rating1;

    @Column(name = "rating2")
    private Integer rating2;

    @Column(name = "feedback_score")
    private Integer feedbackScore;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
