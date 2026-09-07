package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppealDashboardRowDTO {
    private Long id;
    private String department;
    private String officeName;
    private String grievanceUniqId;
    private String appealUniqId;
    private String dateOfAction;
    private String actionTaken;
    private String actionTakenBy;
    private String grievanceForwardedTo;
    private String remark;
    private String status;
}
