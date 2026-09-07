package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceResponseDTO {
    private Long id;
    private String uniqId;
    private String description;
    private String latitude;
    private String longitude;
    private String origin;
    private String status;
    private String finalStatus;
    private String keyFlag;
    private String psga;
    private String fileName;
    private String filePath;
    private String fileType;
    private String secondFileName;
    private String secondFilePath;
    private String secondFileType;
    private String ackSlipName;
    private String ackSlipPath;
    private String cpgramRegNo;
    private String createdAt;
    private String updatedAt;

    // Flat mappings for frontend
    private String department;
    private String grievanceCategory;
    private String subCategory;
    private String subCategoryL2;
    private String subCategoryL3;
    private String subCategoryL4;
    private String district;
    private String division;
    private String windowType;
    private String citizenName;
    private String citizenPhone;

    private ComplainantInfo submittedBy;

    // Detailed view fields
    private String block;
    private String panchayat;
    private String municipality;
    private String ward;
    private String emailId;
    private String address;
    private String appealDescription;
    private java.util.List<HistoryItemDTO> history;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComplainantInfo {
        private Long id;
        private String name;
        private String mobile;
        private String email;
        private String gender;
        private String address;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HistoryItemDTO {
        private Long id;
        private String uniqId;
        private String actionBy;
        private String dateTimeOfAction;
        private String actionTaken;
        private String remarks;
        private String privilegeAssign;
        private String department;
        private String status;
        private Long actionTakenTimeDays;
    }
}
