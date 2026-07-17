package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_master", schema = "jks_3nf", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"uniq_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uniq_id", nullable = false, unique = true)
    private String uniqId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_user_id", nullable = false)
    private Users submittedBy;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "latitude", length = 50)
    private String latitude;

    @Column(name = "longitude", length = 50)
    private String longitude;

    @Column(nullable = false, length = 50)
    private String origin = "JKSAMADHAN";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_cat_l1_id")
    private SubCategoryLevel1 subCatL1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_cat_l2_id")
    private SubCategoryLevel2 subCatL2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_cat_l3_id")
    private SubCategoryLevel3 subCatL3;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_cat_l4_id")
    private SubCategoryLevel4 subCatL4;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "block_id")
    private Block block;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panchayat_id")
    private Panchayat panchayat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "municipality_id")
    private Municipality municipality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @Column(nullable = false, length = 50)
    private String status = "Registered";

    @Column(name = "final_status", length = 50)
    private String finalStatus = "Submitted";

    @Column(name = "key_flag", length = 20)
    private String keyFlag = "Normal";

    @Column(name = "psga", length = 20)
    private String psga = "NA";

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @Column(name = "second_file_name", length = 255)
    private String secondFileName;

    @Column(name = "second_file_path", length = 500)
    private String secondFilePath;

    @Column(name = "second_file_type", length = 50)
    private String secondFileType;

    @Column(name = "ack_slip_name", length = 255)
    private String ackSlipName;

    @Column(name = "ack_slip_path", length = 500)
    private String ackSlipPath;

    @Column(name = "cpgram_reg_no", length = 100)
    private String cpgramRegNo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_user_id")
    private Users updatedBy;
}
