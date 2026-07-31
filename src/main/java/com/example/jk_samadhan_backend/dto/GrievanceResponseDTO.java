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
    private String windowType;
    private String citizenName;
    private String citizenPhone;
    
    private ComplainantInfo submittedBy;

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
    }
}
