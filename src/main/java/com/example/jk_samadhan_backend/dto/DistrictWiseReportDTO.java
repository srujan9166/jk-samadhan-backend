package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistrictWiseReportDTO {
    private String district;
    private long totalCount;
    private long resolvedCount;
    private long pendingCount;
    private long forwardedCount;
    private long dnpCount;
    private long remarkCount;
    private long rejectedCount;
    private long appealedCount;
}
