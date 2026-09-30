package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentUserReportDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String department;
    private String departmentType;
    private String district;
    private String office;
    private String designation;
    private String userType;
    private String createdBy;
    private String createdAt;
    private String mobile;
    private Boolean enabled;
}
