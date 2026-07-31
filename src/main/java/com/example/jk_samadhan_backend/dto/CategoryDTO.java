package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Integer id;
    private Integer departmentId;
    private String departmentName;
    private String name;
    private Integer reminderDays;
}
