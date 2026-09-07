package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jkigrams_dump", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JkigramsDump {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false)
    private String referenceId;

    @Column(name = "grievance_type")
    private String grievanceType;

    @Column(name = "application_date")
    private LocalDateTime applicationDate;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "current_status")
    private String currentStatus;

    @Column(name = "pending_at")
    private String pendingAt;

    @Column(name = "department")
    private String department;

    @Column(name = "gender")
    private String gender;

    @Column(name = "emailid")
    private String emailid;

    @Column(name = "mobileno")
    private String mobileno;

    @Column(name = "constituency")
    private String constituency;

    @Column(name = "cpgrams_regno")
    private String cpgramsRegno;

    @Column(name = "address")
    private String address;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "description", length = 5000)
    private String description;

    @Column(name = "appflag")
    private String appflag;

    @Column(name = "app_file_path")
    private String appFilePath;

    @Column(name = "app_file_name")
    private String appFileName;

    @Column(name = "dept_file_path")
    private String deptFilePath;

    @Column(name = "dept_file_name")
    private String deptFileName;

    @Column(name = "status")
    private String status;

    @Column(name = "forwarded_flag")
    private String forwardedFlag;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    @Column(name = "updatedbyuserid")
    private Long updatedbyuserid;

    @Column(name = "remarks_from_hlg")
    private String remarksFromHlg;

    @Column(name = "from_lg")
    private String fromLg;

    @Column(name = "editattempt")
    private Integer editattempt;

    @Column(name = "doesnotpertain_status")
    private String doesnotpertainStatus;

    @Column(name = "forward_hlg")
    private Integer forwardHlg;

    @Column(name = "data_fetched_on")
    private LocalDateTime dataFetchedOn;

    @Column(name = "depdocument")
    private String depdocument;

    @Column(name = "final_status")
    private String finalStatus;

    @Column(name = "remark")
    private String remark;
}
