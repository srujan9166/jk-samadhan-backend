package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminSummaryDTO {
    private long totalGrievances;
    private long open;
    private long pending;
    private long resolved;
    private long rejected;
    private long escalated;
    private double averageResolutionTimeDays;
    
    // New dynamic dashboard metrics
    private long web;
    private long app;
    private long appealReceivedCount;
    private long forwarded;
    private long dnpCount;
    private long cpgramClosed;
    private long fwdToCPGRAM;
    private long totalCPGRAM;
    
    private Map<String, Long> statusDistribution;
    private List<MapEntryDTO> departmentWiseCounts;
    private List<MapEntryDTO> districtWiseCounts;
    private List<MapEntryDTO> monthlyTrends;
    private List<MapEntryDTO> monthlyCitizenTrends;
    private List<MapEntryDTO> officerWorkloads;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MapEntryDTO {
        private String label;
        private Long value;
    }
}
