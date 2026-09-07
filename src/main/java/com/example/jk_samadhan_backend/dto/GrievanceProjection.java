package com.example.jk_samadhan_backend.dto;

import java.time.LocalDateTime;

public interface GrievanceProjection {
    Long getId();
    String getUniqId();
    String getDescription();
    String getLatitude();
    String getLongitude();
    String getOrigin();
    String getStatus();
    String getFinalStatus();
    String getKeyFlag();
    String getPsga();
    String getFileName();
    String getFilePath();
    String getFileType();
    String getSecondFileName();
    String getSecondFilePath();
    String getSecondFileType();
    String getAckSlipName();
    String getAckSlipPath();
    String getCpgramRegNo();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    
    // Flat mappings
    String getCategoryName();
    String getDeptName();
    String getDistrictName();
    String getSubCategoryName();
    
    Long getSubmitterId();
    String getSubmitterFirstName();
    String getSubmitterMiddleName();
    String getSubmitterLastName();
    String getSubmitterMobile();
    String getSubmitterEmail();
    String getSubmitterGender();

    default String getSubmitterFullName() {
        StringBuilder sb = new StringBuilder();
        if (getSubmitterFirstName() != null) {
            sb.append(getSubmitterFirstName().trim());
        }
        if (getSubmitterMiddleName() != null && !getSubmitterMiddleName().trim().isEmpty()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(getSubmitterMiddleName().trim());
        }
        if (getSubmitterLastName() != null && !getSubmitterLastName().trim().isEmpty()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(getSubmitterLastName().trim());
        }
        return sb.length() > 0 ? sb.toString() : null;
    }
}
