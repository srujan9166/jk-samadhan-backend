package com.example.jk_samadhan_backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdvanceQueryRequestDTO {
    private List<String> gender;
    private List<String> departments;
    private String category;
    private String subCategory;
    private String subCategoryL2;
    private String subCategoryL3;
    private String subCategoryL4;
    private String status;
    private String userType;
    private Integer pendingFrom;
    private Integer pendingTo;
    private String operator;
    private String search;
    private Integer page;
    private Integer size;
}
