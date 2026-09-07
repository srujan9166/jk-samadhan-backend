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
public class PaginatedAppealsResponseDTO {
    private List<AppealDashboardRowDTO> content;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
