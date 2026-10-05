package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedHeatmapDTO {
    private List<HeatmapDistrictDTO> content;
    private long totalGrievances;
    private long totalPending;
    private long totalResolved;
    private long maxDistrictCount;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
