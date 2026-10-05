package com.example.jk_samadhan_backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginatedAverageTimeTakenReportDTO {
    private String mode; // 'department' or 'district'
    private List<AverageTimeTakenReportDTO> content;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
}
