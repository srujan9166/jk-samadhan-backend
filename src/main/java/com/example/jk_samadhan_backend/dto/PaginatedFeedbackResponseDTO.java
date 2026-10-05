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
public class PaginatedFeedbackResponseDTO {
    private List<FeedbackDTO> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}
