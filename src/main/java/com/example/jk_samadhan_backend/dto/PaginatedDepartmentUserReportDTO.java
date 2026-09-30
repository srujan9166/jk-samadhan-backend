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
public class PaginatedDepartmentUserReportDTO {
    private List<DepartmentUserReportDTO> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private List<String> departments;
    private List<String> departmentTypes;
    private List<String> userTypes;
    private List<String> districts;
}
