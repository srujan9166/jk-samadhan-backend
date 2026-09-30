package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusWiseReportDTO {
    private Long id;
    private String departmentName;
    private String officerName;
    private String officeAndDesignation;
    private String userType;
    private String userLevel;
    private String username;

    private long totalCount;
    private long resolvedCount;
    private long pendingCount;
    private long forwardedCount;
    private long dnpCount;
    private long remarkCount;
    private long rejectedCount;
    private long appealedCount;
}
