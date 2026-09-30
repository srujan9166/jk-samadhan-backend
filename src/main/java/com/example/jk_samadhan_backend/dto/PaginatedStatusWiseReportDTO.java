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
public class PaginatedStatusWiseReportDTO {
    private String mode; // "department" or "user"
    private List<StatusWiseReportDTO> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}
