package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jkigrams_movement_log", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JkigramsMovementLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false)
    private String referenceId;

    @Column(name = "department", length = 50)
    private String department;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "description", length = 5000)
    private String description;

    @Column(name = "app_file_path")
    private String appFilePath;

    @Column(name = "app_file_name")
    private String appFileName;

    @Column(name = "dept_file_path")
    private String deptFilePath;

    @Column(name = "dept_file_name")
    private String deptFileName;

    @Column(name = "current_status")
    private String currentStatus;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "appflag")
    private String appflag;

    @Column(name = "sno")
    private Integer sno;
}
