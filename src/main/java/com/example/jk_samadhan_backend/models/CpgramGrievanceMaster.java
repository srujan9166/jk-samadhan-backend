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

    private String name;

    @Column(name = "mobile_no")
    private String mobileNo;

    @Column(name = "phone_no")
    private String phoneNo;

    @Column(name = "email_address")
    private String emailAddress;

    private String gender;

    private String address1;

    private String address2;

    private String address3;

    private String pincode;

    private String district;

    private String state;

    private String country;

    private String category;

    @Column(name = "forwarded_department")
    private String forwardedDepartment;

    @Column(name = "from_org_code")
    private String fromOrgCode;

    @Column(name = "from_org_name")
    private String fromOrgName;

    @Column(name = "subject_content", columnDefinition = "TEXT")
    private String subjectContent;

    @Column(name = "attach_doc")
    private String attachDoc;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "depdocument")
    private String depdocument;

    @Column(name = "dept_file_name")
    private String deptFileName;

    @Column(name = "date_of_receipt")
    private String dateOfReceipt;

    private String status;

    @Column(name = "final_status")
    private String finalStatus;

    @Column(name = "forwarded_flag")
    private String forwardedFlag;

    @Column(name = "nodal_officer")
    private String nodalOfficer;

    @Column(name = "nodal_officer_designation")
    private String nodalOfficerDesignation;

    @Column(columnDefinition = "TEXT")
    private String remark;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "created_date")
    private OffsetDateTime createdDate;

    @Column(name = "updated_date")
    private OffsetDateTime updatedDate;

    private String origin;
}
