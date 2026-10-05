package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeatmapDistrictDTO {
    private Integer districtId;
    private String districtName;
    private long totalGrievances;
    private long pendingGrievances;
    private long resolvedGrievances;
    private long forwardedGrievances;
    private long rejectedGrievances;
    private long appealedGrievances;
    private double heatIntensity; // 0.0 to 1.0 (or percentage)
}
