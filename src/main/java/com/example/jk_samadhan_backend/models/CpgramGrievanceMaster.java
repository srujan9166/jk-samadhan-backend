package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "cpgram_grievance_master", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CpgramGrievanceMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "registration_no", unique = true)
    private String registrationNo;

    private String status;

    @Column(name = "final_status")
    private String finalStatus;

    @Column(name = "forwarded_department")
    private String forwardedDepartment;

    private String district;

    @Column(name = "created_date")
    private OffsetDateTime createdDate;

    @Column(name = "subject_content", columnDefinition = "TEXT")
    private String subjectContent;

    private String origin;
}
