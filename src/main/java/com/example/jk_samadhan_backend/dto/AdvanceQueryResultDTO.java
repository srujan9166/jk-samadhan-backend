package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdvanceQueryResultDTO {
    private Long id;
    private String uniqid;
    private String department;
    private String category;
    private String subCategory;
    private String subCategoryL2;
    private String subCategoryL3;
    private String subCategoryL4;
    private String district;
    private String gender;
    private String name;
    private String createddate;
    private String flag;
    private String status;
    private Long daysdiff;
    private String usertype;
    private String updatedBy;
}
