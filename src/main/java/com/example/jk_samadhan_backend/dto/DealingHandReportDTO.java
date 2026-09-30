package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DealingHandReportDTO {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String designation;
    private String mobile;
    private long totalGrievances;
}
